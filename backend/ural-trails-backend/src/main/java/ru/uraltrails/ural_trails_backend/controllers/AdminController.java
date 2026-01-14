package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.User;
import ru.uraltrails.ural_trails_backend.repositories.UserRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository users;
    private final AuthService auth;

    public AdminController(UserRepository users, AuthService auth) {
        this.users = users;
        this.auth = auth;
    }

    @GetMapping("/users")
    public Object listUsers(@RequestHeader("Authorization") String token) {
        String login = auth.validate(token);
        if (login == null) return "UNAUTHORIZED";

        if (!auth.isAdmin(token)) return "FORBIDDEN";

        List<User> all = users.findAll();

        // пароль с бека точно не отдаём, даже если это админка
        return all.stream()
                .map(u -> new UserRow(
                        u.getId(),
                        u.getLogin(),
                        u.getRole(),
                        u.getRegisteredDate() == null ? "" : u.getRegisteredDate().toString()
                ))
                .toList();
    }

    public record UserRow(Long id, String login, String role, String registeredDate) {}
}
