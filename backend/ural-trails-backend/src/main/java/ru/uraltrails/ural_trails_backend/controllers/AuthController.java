package ru.uraltrails.ural_trails_backend.controllers;

import ru.uraltrails.ural_trails_backend.services.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String login,
            @RequestParam String password
    ) {
        String token = auth.login(login, password);
        if (token == null) {
            return "INVALID";
        }
        return token;
    }
}