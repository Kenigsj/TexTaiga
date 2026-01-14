package ru.uraltrails.ural_trails_backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${app.storage.dir}")
    private String storageDir;

    public StoredFile save(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Файл не выбран");
        }

        // Проверяем, есть ли папка для хранения файлов, и если её нет — создаём.
        // Без этого при первом сохранении всё просто упадёт.
        File dir = new File(storageDir);
        if (!dir.exists()) {
            boolean ok = dir.mkdirs();
            if (!ok) throw new RuntimeException("Не удалось создать папку: " + storageDir);
        }

        // Берём оригинальное имя файла, чисто чтобы сохранить его где-нибудь для истории
        String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();

        // Вытаскиваем расширение, чтобы файл после сохранения нормально открывался
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);

        // Генерируем уникальное имя, чтобы файлы не перетирали друг друга
        String storedName = UUID.randomUUID() + ext;
        Path target = Path.of(storageDir, storedName);

        // Физически сохраняем файл на диск
        Files.copy(file.getInputStream(), target);

        // Возвращаем информацию о файле, чтобы можно было сохранить её в БД
        return new StoredFile(original, storedName, target.toString());
    }

    public record StoredFile(String originalName, String storedName, String filePath) {}
}
