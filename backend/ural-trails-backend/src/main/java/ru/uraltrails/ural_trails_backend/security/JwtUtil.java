package ru.uraltrails.ural_trails_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET = "uraltrails_super_secret_key_please_change_it_1234567890";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private static final long EXP_MS = 7L * 24 * 60 * 60 * 1000;

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

    public static Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String validateToken(String token) {
        try {
            Claims c = parse(token);
            return c.getSubject();
        } catch (Exception ex) {
            return null;
        }
    }

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
