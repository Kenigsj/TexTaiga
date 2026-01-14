package ru.uraltrails.ural_trails_backend.security;

import java.util.HashMap;
import java.util.Map;

public class HardcodedUsers {

    // Оставляем только админа как стартовую точку.
    // Остальные пользователи должны жить в БД.
    private static final Map<String, String> users = new HashMap<>();
    private static final Map<String, String> roles = new HashMap<>();

    static {
        users.put("admin", "12345");
        roles.put("admin", "admin");
    }

    public static boolean isValid(String login, String password) {
        if (login == null || password == null) return false;
        if (!users.containsKey(login)) return false;
        return users.get(login).equals(password);
    }

    public static String roleOf(String login) {
        return roles.getOrDefault(login, "jury");
    }
}
