package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:3000")
public class ParticipantsController {

    private final ParticipantRepository participants;
    private final AuthService auth;

    public ParticipantsController(ParticipantRepository participants, AuthService auth) {
        this.participants = participants;
        this.auth = auth;
    }

    @GetMapping
    public Object list(
            @RequestHeader("Authorization") String token,
            @RequestParam Long nomination
    ) {
        // сначала просто проверяем, что токен вообще живой
        String login = auth.validate(token);
        if (login == null) return "UNAUTHORIZED";

        // дальше уже смотрим, какая у пользователя роль
        String role = auth.roleFromToken(token);

        // админ и модератор видят все фотки в номинации, без фильтра по статусу
        if ("admin".equals(role) || "moderator".equals(role)) {
            return participants.findByNomination(nomination);
        }

        // жюри видит только те, которые уже одобрены модератором
        return participants.findByNominationAndStatus(nomination, "approved");
    }
}
