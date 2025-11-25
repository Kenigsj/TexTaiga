package ru.uraltrails.ural_trails_backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.uraltrails.ural_trails_backend.models.Vote;
import ru.uraltrails.ural_trails_backend.services.AuthService;
import ru.uraltrails.ural_trails_backend.services.VoteService;

@RestController
@RequestMapping("/api/vote")
@CrossOrigin(origins = "http://localhost:3000")
public class VoteController {

    private final VoteService voteService;
    private final AuthService authService;

    public VoteController(VoteService voteService, AuthService authService) {
        this.voteService = voteService;
        this.authService = authService;
    }

    @PostMapping("/set")
    public Object setVote(
            @RequestHeader("Authorization") String token,
            @RequestParam Long participantId,
            @RequestParam Integer nomination,
            @RequestParam Integer score
    ) {
        System.out.println(">>> VoteController called");
        System.out.println("participantId = " + participantId);
        System.out.println("nomination = " + nomination);
        System.out.println("score = " + score);

        // 1) проверяем токен
        String login = authService.validate(token);
        if (login == null) {
            return "UNAUTHORIZED";
        }

        // 2) временно делаем juryId на основе login
        Long juryId = (long) login.hashCode();

        // 3) сохраняем в БД
        voteService.addVote(juryId, participantId, nomination, score);

        return "OK";
    }
}
