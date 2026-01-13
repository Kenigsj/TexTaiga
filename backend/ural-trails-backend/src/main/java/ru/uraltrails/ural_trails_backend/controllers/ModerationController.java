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
        if (!isModerator(token)) return "FORBIDDEN";
        Participant p = participants.findById(id).orElse(null);
        if (p == null) return "NOT_FOUND";
        p.setStatus("approved");
        participants.save(p);
        return "OK";
    }

    @PostMapping("/participant/{id}/reject")
    public String reject(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!isModerator(token)) return "FORBIDDEN";
        Participant p = participants.findById(id).orElse(null);
        if (p == null) return "NOT_FOUND";
        p.setStatus("rejected");
        participants.save(p);
        return "OK";
    }

    private boolean isModerator(String token) {
        String login = auth.validate(token);
        if (login == null) return false;
        return "moderation".equals(auth.roleFromToken(token));
    }
}
