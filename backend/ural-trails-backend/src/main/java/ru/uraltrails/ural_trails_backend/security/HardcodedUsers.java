package ru.uraltrails.ural_trails_backend.security;

import java.util.HashMap;
import java.util.Map;

public class HardcodedUsers {

    private static final Map<String, String> users = new HashMap<>();
    private static final Map<String, String> roles = new HashMap<>();

    static {
        users.put("jury1", "pass1");
        roles.put("jury1", "jury");

        users.put("jury2", "pass2");
        roles.put("jury2", "jury");

        users.put("admin", "12345");
        roles.put("admin", "moderation");
    }

    public static boolean isValid(String login, String password) {
        if (!users.containsKey(login)) return false;
        return users.get(login).equals(password);
    }

    public static String roleOf(String login) {
        return roles.getOrDefault(login, "jury");
    }
}
