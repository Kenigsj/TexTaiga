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

    @PostMapping("/set")
    public String setVote(
            @RequestHeader("Authorization") String token,
            @RequestParam Long participantId,
            @RequestParam Integer nomination,
            @RequestParam Integer score
    ) {
        User u = auth.me(token);
        if (u == null) return "UNAUTHORIZED";
        if (!"jury".equals(u.getRole())) return "FORBIDDEN";
        if (score == null || score < 1 || score > 10) return "INVALID_SCORE";
        votes.addVote(u.getId(), participantId, nomination, score);
        return "OK";
    }
}
