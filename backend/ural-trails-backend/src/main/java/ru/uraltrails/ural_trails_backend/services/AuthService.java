package ru.uraltrails.ural_trails_backend.services;

import ru.uraltrails.ural_trails_backend.security.HardcodedUsers;
import ru.uraltrails.ural_trails_backend.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public String login(String login, String password) {
        // если неверный логин/пароль → возвращаем null
        if (!HardcodedUsers.isValid(login, password)) {
            return null;
        }

        // иначе создаём токен
        return JwtUtil.generateToken(login);
    }

    public String validate(String token) {
        return JwtUtil.validateToken(token);
    }
}