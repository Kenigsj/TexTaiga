package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.User;
import ru.uraltrails.ural_trails_backend.services.AuthService;
import ru.uraltrails.ural_trails_backend.services.VoteService;

@RestController
@RequestMapping("/api/vote")
@CrossOrigin(origins = "http://localhost:3000")
public class VoteController {

    private final VoteService votes;
    private final AuthService auth;

    public VoteController(VoteService votes, AuthService auth) {
        this.votes = votes;
        this.auth = auth;
    }

    // сюда жюри отправляет свою оценку за конкретную фотографию
    // participantId — это id участника (фотки),
    // nomination — в какой номинации ставится оценка,
    // score — сама оценка от 1 до 10
    @PostMapping("/set")
    public String setVote(
            @RequestHeader("Authorization") String token,
            @RequestParam Long participantId,
            @RequestParam Integer nomination,
            @RequestParam Integer score
    ) {
        // сначала проверяем, что вообще есть такой пользователь
        User u = auth.me(token);
        if (u == null) return "UNAUTHORIZED";

        // голосовать может только жюри, остальные сюда попадать не должны
        if (!"jury".equals(u.getRole())) return "FORBIDDEN";

        // защита от мусора: оценка только в диапазоне 1–10
        if (score == null || score < 1 || score > 10) return "INVALID_SCORE";

        // сохраняем голос: кто проголосовал, за кого, в какой номинации и на сколько баллов
        votes.addVote(u.getId(), participantId, nomination, score);

        return "OK";
    }
}
