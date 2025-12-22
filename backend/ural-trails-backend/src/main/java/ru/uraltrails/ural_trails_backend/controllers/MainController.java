package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Participant;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class MainController {

    private final ParticipantRepository participants;
    private final AuthService auth;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public MainController(ParticipantRepository participants, AuthService auth) {
        this.participants = participants;
        this.auth = auth;
    }

    @GetMapping("/participants")
    public Object getParticipants(@RequestHeader("Authorization") String token) {

        String login = auth.validate(token);
        if (login == null) {
            return "UNAUTHORIZED";
        }

        // Я не хочу, чтобы в выдаче висели участники без реального файла.
        // Поэтому проверяю: если файл удалили из папки — удаляю и запись в БД.
        List<Participant> all = participants.findAll();
        List<Participant> result = new ArrayList<>();

        for (Participant p : all) {
            String photoUrl = p.getPhotoUrl();

            if (photoUrl == null || photoUrl.isBlank()) {
                participants.delete(p);
                continue;
            }

            try {
                Path filePath = resolveFilePath(photoUrl);

                if (filePath == null || !Files.exists(filePath)) {
                    participants.delete(p);
                    continue;
                }

                result.add(p);

            } catch (Exception ex) {
                participants.delete(p);
            }
        }

        return result;
    }

    // Я привожу photoUrl к реальному пути на диске.
    // Если photoUrl хранится как URL (/api/public/files/...), вытаскиваю имя файла и собираю путь через app.upload.dir.
    private Path resolveFilePath(String photoUrl) {
        // если в базе лежит путь на диске — работаю напрямую
        if (photoUrl.startsWith("D:/") || photoUrl.startsWith("D:\\") || photoUrl.contains(":\\")) {
            return Path.of(photoUrl);
        }

        // если в базе лежит URL — вытаскиваю имя файла
        int idx = photoUrl.lastIndexOf('/');
        if (idx < 0 || idx == photoUrl.length() - 1) {
            return null;
        }

        String fileName = photoUrl.substring(idx + 1);
        return Path.of(uploadDir).resolve(fileName).normalize();
    }

    @PostMapping("/login")
    public String login(@RequestParam String login, @RequestParam String password) {
        return auth.login(login, password);
    }
}
