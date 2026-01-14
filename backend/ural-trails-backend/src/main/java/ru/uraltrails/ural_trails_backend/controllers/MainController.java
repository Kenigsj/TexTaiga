package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.services.AuthService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class MainController {

    private final AuthService auth;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public MainController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public String login(@RequestParam String login, @RequestParam String password) {
        // это старый вариант логина, по сути дублирует /api/auth/login
        // сейчас почти везде используется AuthController, но этот оставил,
        // чтобы не ломать уже написанный фронт
        return auth.login(login, password);
    }
}
