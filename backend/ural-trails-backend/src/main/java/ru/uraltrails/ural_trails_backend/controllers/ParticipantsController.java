package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Participant;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

import java.util.List;

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
            @RequestParam Integer nomination
    ) {
        String login = auth.validate(token);
        if (login == null) return "UNAUTHORIZED";

        String role = auth.roleFromToken(token);
        if ("moderation".equals(role)) {
            return participants.findByNomination(nomination);
        }

        return participants.findByNominationAndStatus(nomination, "approved");
    }
}
