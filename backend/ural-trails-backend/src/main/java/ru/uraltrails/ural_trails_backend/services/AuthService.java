package ru.uraltrails.ural_trails_backend.services;

import org.springframework.stereotype.Service;
import ru.uraltrails.ural_trails_backend.models.User;
import ru.uraltrails.ural_trails_backend.repositories.UserRepository;
import ru.uraltrails.ural_trails_backend.security.HardcodedUsers;
import ru.uraltrails.ural_trails_backend.security.JwtUtil;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository users;

    public AuthService(UserRepository users) {
        this.users = users;
    }

    public String login(String login, String password) {
        if (login == null || password == null) return null;

        User dbUser = users.findByLogin(login);

        // 1) если пользователь есть в БД — проверяем пароль и выдаём токен
        if (dbUser != null) {
            if (!dbUser.getPassword().equals(password)) return null;
            return JwtUtil.generateToken(dbUser.getLogin(), dbUser.getRole());
        }

        // 2) иначе проверяем хардкод (только admin) и при успехе создаём запись в БД
        if (!HardcodedUsers.isValid(login, password)) return null;

        User u = new User();
        u.setLogin(login);
        u.setPassword(password);
        u.setRole(HardcodedUsers.roleOf(login)); // admin
        u.setRegisteredDate(LocalDate.now());
        users.save(u);

        return JwtUtil.generateToken(u.getLogin(), u.getRole());
    }

    // Регистрация должна быть доступна ТОЛЬКО админу (проверяем токен)
    public String register(String token, String login, String password, String role) {
        if (!isAdmin(token)) return "FORBIDDEN";

        if (login == null || login.isBlank()) return null;
        if (password == null || password.isBlank()) return null;

        String r = normalizeRole(role);
        if (r == null) return null;

        if (users.findByLogin(login) != null) return "EXISTS";

        User u = new User();
        u.setLogin(login.trim());
        u.setPassword(password);
        u.setRole(r);
        u.setRegisteredDate(LocalDate.now());
        users.save(u);

        // ВАЖНО: регистрируемого пользователя не логиним автоматически
        // поэтому токен здесь не нужен
        return "OK";
    }

    public String validate(String token) {
        return JwtUtil.validateToken(stripBearer(token));
    }

    public String roleFromToken(String token) {
        return JwtUtil.roleFromToken(stripBearer(token));
    }

    public User me(String token) {
        String t = stripBearer(token);
        String login = JwtUtil.validateToken(t);
        if (login == null) return null;
        return users.findByLogin(login);
    }

    public String changePassword(String token, String currentPassword, String newPassword) {
        User u = me(token);
        if (u == null) return "UNAUTHORIZED";
        if (currentPassword == null || !u.getPassword().equals(currentPassword)) return "INVALID_PASSWORD";
        if (newPassword == null || newPassword.length() < 6) return "WEAK_PASSWORD";
        u.setPassword(newPassword);
        users.save(u);
        return "OK";
    }

    public String deleteAccount(String token, String password) {
        User u = me(token);
        if (u == null) return "UNAUTHORIZED";
        if (password == null || !u.getPassword().equals(password)) return "INVALID_PASSWORD";
        users.delete(u);
        return "OK";
    }

    public boolean isAdmin(String token) {
        String login = validate(token);
        if (login == null) return false;
        return "admin".equals(roleFromToken(token));
    }

    private static String normalizeRole(String role) {
        if (role == null) return null;
        String r = role.trim().toLowerCase();
        if (r.equals("jury")) return "jury";
        if (r.equals("moderator")) return "moderator";
        if (r.equals("admin")) return "admin";
        return null;
    }

    private static String stripBearer(String token) {
        if (token == null) return null;
        String t = token.trim();
        if (t.toLowerCase().startsWith("bearer ")) return t.substring(7).trim();
        return t;
    }
}
