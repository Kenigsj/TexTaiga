package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/public/files")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicFilesController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {

        // собираем полный путь до файла из папки загрузок и имени файла
        Path filePath = Path.of(uploadDir).resolve(fileName).normalize();
        FileSystemResource resource = new FileSystemResource(filePath);

        // если файла реально нет на диске — сразу 404, без лишних попыток
        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // по умолчанию считаем, что это просто бинарный файл
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        // по расширению пытаемся понять, что это картинка, чтобы браузер нормально её показал
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if (lower.endsWith(".png")) {
            mediaType = MediaType.IMAGE_PNG;
        } else if (lower.endsWith(".gif")) {
            mediaType = MediaType.IMAGE_GIF;
        }

        // возвращаем файл как ресурс, с правильным типом контента
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }
}
