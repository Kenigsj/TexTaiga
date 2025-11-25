package ru.uraltrails.ural_trails_backend.controllers;

import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class MainController {

    private ParticipantRepository participants;
    private final AuthService auth;

    public MainController(AuthService auth) {
        this.auth = auth;
    }

    @GetMapping("/participants")
    public Object getParticipants(@RequestHeader("Authorization") String token) {

        String login = auth.validate(token);

        if (login == null) {
            return "UNAUTHORIZED";
        }

        return participants.findAll();
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String login,
            @RequestParam String password
    ) {
        return auth.login(login, password);
    }
}