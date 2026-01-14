package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import ru.uraltrails.ural_trails_backend.models.Participant;
import ru.uraltrails.ural_trails_backend.repositories.NominationRepository;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicUploadController {

    private final ParticipantRepository participants;
    private final NominationRepository nominations;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public PublicUploadController(ParticipantRepository participants, NominationRepository nominations) {
        this.participants = participants;
        this.nominations = nominations;
    }

    @PostMapping("/upload")
    public String upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fio") String fio,
            @RequestParam("email") String email,
            @RequestParam("nominationId") Long nominationId
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Файл пустой");
        }

        if (nominationId == null || nominationId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Некорректная номинация");
        }

        // тут просто отсекаем ситуацию, когда фронт прислал id, которого уже нет в таблице nominations
        if (!nominations.existsById(nominationId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Номинация не найдена");
        }

        try {
            // папка для загрузок может не существовать на чистом сервере, поэтому создаём её на месте
            Path dir = Path.of(uploadDir);
            Files.createDirectories(dir);

            // имя файла оставляем случайным, чтобы не было конфликтов, но расширение сохраняем
            String original = file.getOriginalFilename() == null ? "photo" : file.getOriginalFilename();
            String ext = "";
            int dot = original.lastIndexOf('.');
            if (dot >= 0) ext = original.substring(dot);

            String storedName = UUID.randomUUID() + ext;
            Path target = dir.resolve(storedName);

            file.transferTo(target.toFile());

            // из ФИО пытаемся хоть как-то вытащить имя/фамилию, но если там каша — просто не ломаемся
            String safeFio = fio == null ? "" : fio.trim();
            String[] parts = safeFio.isBlank() ? new String[0] : safeFio.split("\\s+");
            String lastName = parts.length >= 1 ? parts[0] : "";
            String firstName = parts.length >= 2 ? parts[1] : "";

            Participant p = new Participant();
            p.setFirstName(firstName);
            p.setLastName(lastName);
            p.setFio(safeFio);
            p.setEmail(email == null ? "" : email.trim());

            // ссылка формируется под наш PublicFilesController, чтобы фронт мог просто вставить её в <img src="...">
            p.setPhotoUrl("http://localhost:8080/api/public/files/" + storedName);

            // самое важное: сохраняем именно тот id номинации, который выбрали на UploadPage
            p.setNomination(nominationId);

            p.setStatus("pending");
            p.setUploadedAt(LocalDateTime.now());

            participants.save(p);

            return "OK";
        } catch (ResponseStatusException ex) {
            // если мы сами кинули осмысленную ошибку выше — пусть она так и улетает на фронт
            throw ex;
        } catch (Exception e) {
            // сюда попадает всё остальное: проблемы с диском, правами, кривым файлом и т.д.
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка сохранения файла");
        }
    }
}
