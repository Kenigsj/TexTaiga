package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.User;
import ru.uraltrails.ural_trails_backend.services.AuthService;
import ru.uraltrails.ural_trails_backend.services.RatingService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RatingController {

    private final RatingService rating;
    private final AuthService auth;

    public RatingController(RatingService rating, AuthService auth) {
        this.rating = rating;
        this.auth = auth;
    }

    // основной эндпоинт для страницы рейтинга
    // фронт дергает его, чтобы получить таблицу с участниками, их ФИО, email и итоговыми баллами
    @GetMapping("/api/participants/rating")
    public Object participantsRating(@RequestHeader("Authorization") String token) {
        User u = auth.me(token);
        if (u == null) return "UNAUTHORIZED";

        // по ТЗ рейтинг может смотреть только жюри, модераторам и админам сюда ходить не надо
        if (!"jury".equals(u.getRole())) return "FORBIDDEN";

        return rating.buildParticipantRating();
    }

    // это вспомогательный эндпоинт, на текущий момент фронт его не использует
    // оставлен на будущее, если вдруг понадобится видеть все оценки поштучно:
    // кто, кому, в какой номинации и сколько поставил
    @GetMapping("/api/rating/votes")
    public Object allVotes(@RequestHeader("Authorization") String token) {
        User u = auth.me(token);
        if (u == null) return "UNAUTHORIZED";

        // тут логика такая же, доступ только для жюри
        if (!"jury".equals(u.getRole())) return "FORBIDDEN";

        return rating.buildVotesList();
    }
}
