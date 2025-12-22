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

        // создаём папку, если нет
        File dir = new File(storageDir);
        if (!dir.exists()) {
            boolean ok = dir.mkdirs();
            if (!ok) throw new RuntimeException("Не удалось создать папку: " + storageDir);
        }

        String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();

        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);

        String storedName = UUID.randomUUID() + ext;
        Path target = Path.of(storageDir, storedName);

        Files.copy(file.getInputStream(), target);

        return new StoredFile(original, storedName, target.toString());
    }

    public record StoredFile(String originalName, String storedName, String filePath) {}
}
