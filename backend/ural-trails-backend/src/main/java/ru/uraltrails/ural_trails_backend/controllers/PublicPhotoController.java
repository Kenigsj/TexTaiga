package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Photo;
import ru.uraltrails.ural_trails_backend.repositories.PhotoRepository;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicPhotoController {

    private final PhotoRepository photoRepository;

    public PublicPhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @GetMapping("/photo/{id}")
    public ResponseEntity<Resource> getPhoto(@PathVariable Long id) throws Exception {

        // сначала ищем запись о фото в базе, без неё вообще нет смысла идти в файловую систему
        Photo photo = photoRepository.findById(id).orElse(null);
        if (photo == null) {
            return ResponseEntity.notFound().build();
        }

        // из БД берём путь к файлу и проверяем, что файл реально существует
        Path path = Path.of(photo.getFilePath());
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        // пробуем определить тип файла автоматически, чтобы браузер понял, что это за формат
        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            // если вдруг не получилось определить, отдаём как обычный бинарный файл
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        // оборачиваем файл в Resource, чтобы Spring мог нормально его отдать клиенту
        Resource resource = new FileSystemResource(path.toFile());

        // возвращаем сам файл + правильный Content-Type
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
