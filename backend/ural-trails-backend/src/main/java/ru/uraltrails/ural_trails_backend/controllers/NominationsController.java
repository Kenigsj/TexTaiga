package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Nomination;
import ru.uraltrails.ural_trails_backend.repositories.NominationRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

import java.util.List;

@RestController
@RequestMapping("/api/nominations")
@CrossOrigin(origins = "http://localhost:3000")
public class NominationsController {

    private final NominationRepository nominations;
    private final AuthService auth;

    public NominationsController(NominationRepository nominations, AuthService auth) {
        this.nominations = nominations;
        this.auth = auth;
    }

    @GetMapping
    public Object list(@RequestHeader("Authorization") String token) {
        String login = auth.validate(token);
        if (login == null) return "UNAUTHORIZED";
        return nominations.findAll();
    }

    @PostMapping
    public String create(
            @RequestHeader("Authorization") String token,
            @RequestBody NominationRequest body
    ) {
        if (!auth.isAdmin(token)) return "FORBIDDEN";
        if (body == null || body.title() == null || body.title().trim().isBlank()) return "INVALID";

        String title = body.title().trim();
        if (nominations.existsByTitle(title)) return "EXISTS";

        Nomination n = new Nomination();
        n.setTitle(title);
        nominations.save(n);
        return "OK";
    }

    @PutMapping("/{id}")
    public String update(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody NominationRequest body
    ) {
        if (!auth.isAdmin(token)) return "FORBIDDEN";
        if (body == null || body.title() == null || body.title().trim().isBlank()) return "INVALID";

        Nomination n = nominations.findById(id).orElse(null);
        if (n == null) return "NOT_FOUND";

        n.setTitle(body.title().trim());
        nominations.save(n);
        return "OK";
    }

    @DeleteMapping("/{id}")
    public String delete(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id
    ) {
        if (!auth.isAdmin(token)) return "FORBIDDEN";
        if (!nominations.existsById(id)) return "NOT_FOUND";
        nominations.deleteById(id);
        return "OK";
    }

    public record NominationRequest(String title) {}
}
