package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.User;
import ru.uraltrails.ural_trails_backend.services.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public String login(@RequestParam String login, @RequestParam String password) {
        String token = auth.login(login, password);
        if (token == null) return "INVALID";
        return token;
    }

    @PostMapping("/register")
    public String register(@RequestParam String login, @RequestParam String password, @RequestParam String role) {
        String token = auth.register(login, password, role);
        if (token == null) return "INVALID";
        return token;
    }

    @GetMapping("/me")
    public Object me(@RequestHeader("Authorization") String token) {
        User u = auth.me(token);
        if (u == null) return "UNAUTHORIZED";
        return new MeResponse(u.getId(), u.getLogin(), u.getRole(), u.getRegisteredDate().toString());
    }

    @PostMapping("/change-password")
    public String changePassword(
            @RequestHeader("Authorization") String token,
            @RequestParam String currentPassword,
            @RequestParam String newPassword
    ) {
        return auth.changePassword(token, currentPassword, newPassword);
    }

    @PostMapping("/delete")
    public String delete(
            @RequestHeader("Authorization") String token,
            @RequestParam String password
    ) {
        return auth.deleteAccount(token, password);
    }

    public record MeResponse(Long id, String login, String role, String registeredDate) {}
}
