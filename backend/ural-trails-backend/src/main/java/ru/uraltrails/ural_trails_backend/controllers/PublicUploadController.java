package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import ru.uraltrails.ural_trails_backend.models.Participant;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicUploadController {

    private final ParticipantRepository participants;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public PublicUploadController(ParticipantRepository participants) {
        this.participants = participants;
    }

    @PostMapping("/upload")
    public String upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fio") String fio,
            @RequestParam("email") String email
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Файл пустой");
        }

        try {
            // я создаю папку, если её ещё нет
            Path dir = Path.of(uploadDir);
            Files.createDirectories(dir);

            // я сохраняю файл под уникальным именем
            String original = file.getOriginalFilename() == null ? "photo" : file.getOriginalFilename();
            String ext = "";
            int dot = original.lastIndexOf('.');
            if (dot >= 0) ext = original.substring(dot);

            String storedName = UUID.randomUUID() + ext;
            Path target = dir.resolve(storedName);

            file.transferTo(target.toFile());

            // я разбиваю ФИО на имя/фамилию максимально просто
            String[] parts = fio.trim().split("\\s+");
            String lastName = parts.length >= 1 ? parts[0] : "";
            String firstName = parts.length >= 2 ? parts[1] : "";

            Participant p = new Participant();
            p.setFirstName(firstName);
            p.setLastName(lastName);

            // я сохраняю URL, который откроет браузер
            p.setPhotoUrl("http://localhost:8080/api/public/files/" + storedName);

            // я отправляю все загрузки в 1 номинацию (Лучший фотограф)
            p.setNomination(1);

            participants.save(p);

            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка сохранения файла");
        }
    }
}
