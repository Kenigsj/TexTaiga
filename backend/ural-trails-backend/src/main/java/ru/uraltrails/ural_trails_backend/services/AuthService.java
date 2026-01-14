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
        // Если прилетело что-то пустое — даже не пытаемся “угадывать”, просто отваливаемся
        if (login == null || password == null) return null;

        // Сначала ищем в базе: если пользователь уже есть — логиним по нему
        User dbUser = users.findByLogin(login);

        if (dbUser != null) {
            // Пароли тут сравниваются как строки (без хэша) — это ок для прототипа,
            // но на проде такое лучше не оставлять :)
            if (!dbUser.getPassword().equals(password)) return null;
            return JwtUtil.generateToken(dbUser.getLogin(), dbUser.getRole());
        }

        // Если в базе нет — проверяем “захардкоженных” (видимо, тестовые/служебные аккаунты)
        if (!HardcodedUsers.isValid(login, password)) return null;

        // Первый вход под захардкоженным пользователем:
        // создаём запись в БД, чтобы дальше он жил как обычный пользователь
        User u = new User();
        u.setLogin(login);
        u.setPassword(password);
        u.setRole(HardcodedUsers.roleOf(login));
        u.setRegisteredDate(LocalDate.now());
        users.save(u);

        return JwtUtil.generateToken(u.getLogin(), u.getRole());
    }

    public String register(String token, String login, String password, String role) {
        // Регистрация только для админа — если не админ, даже дальше не идём
        if (!isAdmin(token)) return "FORBIDDEN";

        if (login == null || login.isBlank()) return null;
        if (password == null || password.isBlank()) return null;

        // Приводим роль к нормальному виду, чтобы не ловить “moderation/moderator” и т.п.
        String r = normalizeRole(role);
        if (r == null) return null;

        // Если логин уже занят — честно говорим “занят”, а не перетираем пользователя
        if (users.findByLogin(login) != null) return "EXISTS";

        User u = new User();
        u.setLogin(login.trim());
        u.setPassword(password);
        u.setRole(r);
        u.setRegisteredDate(LocalDate.now());
        users.save(u);

        return "OK";
    }

    public String validate(String token) {
        // validate() ждёт голый токен, поэтому сначала срезаем "Bearer "
        return JwtUtil.validateToken(stripBearer(token));
    }

    public String roleFromToken(String token) {
        return JwtUtil.roleFromToken(stripBearer(token));
    }

    public User me(String token) {
        // Достаём логин из токена, а потом ищем пользователя в базе
        String t = stripBearer(token);
        String login = JwtUtil.validateToken(t);
        if (login == null) return null;
        return users.findByLogin(login);
    }

    public String changePassword(String token, String currentPassword, String newPassword) {
        User u = me(token);
        if (u == null) return "UNAUTHORIZED";

        // Старый пароль проверяем “в лоб”, иначе любой мог бы менять пароль без подтверждения
        if (currentPassword == null || !u.getPassword().equals(currentPassword)) return "INVALID_PASSWORD";

        // Минимальная проверка на “не совсем мусор”
        if (newPassword == null || newPassword.length() < 6) return "WEAK_PASSWORD";

        u.setPassword(newPassword);
        users.save(u);
        return "OK";
    }

    public String deleteAccount(String token, String password) {
        User u = me(token);
        if (u == null) return "UNAUTHORIZED";

        // Тут тот же смысл: удаление аккаунта только если человек знает пароль
        if (password == null || !u.getPassword().equals(password)) return "INVALID_PASSWORD";

        users.delete(u);
        return "OK";
    }

    public boolean isAdmin(String token) {
        // validate() проверяет подпись/срок, roleFromToken() вытаскивает роль
        // Если токен кривой — validate() вернёт null и мы не дадим доступ
        String login = validate(token);
        if (login == null) return false;
        return "admin".equals(roleFromToken(token));
    }

    private static String normalizeRole(String role) {
        if (role == null) return null;

        String r = role.trim().toLowerCase();

        // Когда-то на фронте модератора называли "moderation".
        // Пусть это тоже считается “модератором”, чтобы не ломать регистрацию старым клиентам.
        if (r.equals("moderation")) r = "moderator";

        if (r.equals("jury")) return "jury";
        if (r.equals("moderator")) return "moderator";
        if (r.equals("admin")) return "admin";
        return null;
    }

    private static String stripBearer(String token) {
        // Фронт обычно шлёт заголовок в виде: "Bearer <token>"
        // А JwtUtil ждёт просто сам токен, без префикса
        if (token == null) return null;
        String t = token.trim();
        if (t.toLowerCase().startsWith("bearer ")) return t.substring(7).trim();
        return t;
    }
}
