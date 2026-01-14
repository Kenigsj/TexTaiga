package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Nomination;
import ru.uraltrails.ural_trails_backend.repositories.NominationRepository;
import ru.uraltrails.ural_trails_backend.services.AuthService;

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
        // просто проверяем, что пользователь вообще авторизован
        String login = auth.validate(token);
        if (login == null) return "UNAUTHORIZED";

        // список номинаций можно отдавать всем авторизованным
        return nominations.findAll();
    }

    @PostMapping
    public String create(
            @RequestHeader("Authorization") String token,
            @RequestBody NominationRequest body
    ) {
        // создавать номинации может только админ
        if (!auth.isAdmin(token)) return "FORBIDDEN";

        // минимальная защита от пустых запросов и мусора
        if (body == null || body.title() == null || body.title().trim().isBlank()) return "INVALID";

        String title = body.title().trim();

        // если такая номинация уже есть, второй раз её создавать не даём
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
        // опять же, только админ имеет право что-то менять
        if (!auth.isAdmin(token)) return "FORBIDDEN";

        // без названия обновлять смысла нет
        if (body == null || body.title() == null || body.title().trim().isBlank()) return "INVALID";

        // ищем нужную номинацию, если её нет — значит id пришёл кривой
        Nomination n = nominations.findById(id).orElse(null);
        if (n == null) return "NOT_FOUND";

        // просто меняем название и сохраняем обратно
        n.setTitle(body.title().trim());
        nominations.save(n);

        return "OK";
    }

    @DeleteMapping("/{id}")
    public String delete(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id
    ) {
        // удаление — это тоже только для админа
        if (!auth.isAdmin(token)) return "FORBIDDEN";

        // если такой номинации нет, то и удалять нечего
        if (!nominations.existsById(id)) return "NOT_FOUND";

        // обычное удаление по id
        nominations.deleteById(id);

        return "OK";
    }

    public record NominationRequest(String title) {}
}
