package ru.uraltrails.ural_trails_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    // Секретный ключ для подписи токенов.
    // По-хорошему, его надо хранить в env или в application.properties, а не в коде,
    // но для локальной разработки так проще.
    private static final String SECRET = "uraltrails_super_secret_key_please_change_it_1234567890";

    // Генерим реальный криптоключ из строки
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    // Сколько живёт токен: 7 дней
    private static final long EXP_MS = 7L * 24 * 60 * 60 * 1000;

    // Создаём JWT токен.
    // Внутрь кладём:
    //  - subject → логин пользователя
    //  - role → его роль (admin / moderator / jury)
    //  - дату создания
    //  - дату окончания жизни токена
    public static String generateToken(String login, String role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(login)
                .claim("role", role)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + EXP_MS))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Разбираем токен и вытаскиваем все claims.
    // Если токен битый, просрочен или подделан — тут сразу упадёт exception.
    public static Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Проверяем токен и возвращаем логин пользователя.
    // Если что-то не так — возвращаем null и считаем, что пользователь не авторизован.
    public static String validateToken(String token) {
        try {
            Claims c = parse(token);
            return c.getSubject();
        } catch (Exception ex) {
            return null;
        }
    }

    // Достаём роль пользователя из токена.
    // Используется везде, где надо проверить доступ:
    // админка, модерация, рейтинг, голосование и т.д.
    public static String roleFromToken(String token) {
        try {
            Claims c = parse(token);
            Object role = c.get("role");
            return role == null ? null : role.toString();
        } catch (Exception ex) {
            return null;
        }
    }
}
