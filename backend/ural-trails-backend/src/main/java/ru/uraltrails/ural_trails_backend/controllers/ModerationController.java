package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Participant;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

@RestController
@RequestMapping("/api/moderation")
@CrossOrigin(origins = "http://localhost:3000")
public class ModerationController {

    private final ParticipantRepository participants;
    private final AuthService auth;

    public ModerationController(ParticipantRepository participants, AuthService auth) {
        this.participants = participants;
        this.auth = auth;
    }

    @PostMapping("/participant/{id}/approve")
    public String approve(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        // сюда может попасть только модератор, иначе сразу отсекаем
        if (!isModerator(token)) return "FORBIDDEN";

        // ищем участника по id, если вдруг такого нет — значит что-то пошло не так
        Participant p = participants.findById(id).orElse(null);
        if (p == null) return "NOT_FOUND";

        // помечаем фотку как одобренную
        p.setStatus("approved");
        participants.save(p);

        return "OK";
    }

    @PostMapping("/participant/{id}/reject")
    public String reject(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        // та же самая логика, что и в approve, только статус другой
        if (!isModerator(token)) return "FORBIDDEN";

        Participant p = participants.findById(id).orElse(null);
        if (p == null) return "NOT_FOUND";

        // отклонённые фотки дальше никуда не идут, просто остаются в базе как rejected
        p.setStatus("rejected");
        participants.save(p);

        return "OK";
    }

    private boolean isModerator(String token) {
        // сначала проверяем, что токен вообще валидный
        String login = auth.validate(token);
        if (login == null) return false;

        // потом уже смотрим роль, тут нас интересует только модератор
        String role = auth.roleFromToken(token);
        return "moderator".equals(role);
    }
}
