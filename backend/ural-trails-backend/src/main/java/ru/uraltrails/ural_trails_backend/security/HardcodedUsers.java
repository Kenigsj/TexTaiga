package ru.uraltrails.ural_trails_backend.security;

import java.util.HashMap;
import java.util.Map;

public class HardcodedUsers {

    private static final Map<String, String> users = new HashMap<>();

    static {
        users.put("jury1", "pass1");
        users.put("jury2", "pass2");
        users.put("admin", "12345");
    }

    public static boolean isValid(String login, String password) {
        if (!users.containsKey(login)) return false;
        return users.get(login).equals(password);
    }
}