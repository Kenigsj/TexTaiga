package ru.uraltrails.ural_trails_backend.services;

import org.springframework.stereotype.Service;
import ru.uraltrails.ural_trails_backend.models.Participant;
import ru.uraltrails.ural_trails_backend.models.User;
import ru.uraltrails.ural_trails_backend.models.Vote;
import ru.uraltrails.ural_trails_backend.repositories.ParticipantRepository;
import ru.uraltrails.ural_trails_backend.repositories.UserRepository;
import ru.uraltrails.ural_trails_backend.repositories.VoteRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RatingService {

    private final VoteRepository votes;
    private final ParticipantRepository participants;
    private final UserRepository users;

    public RatingService(VoteRepository votes, ParticipantRepository participants, UserRepository users) {
        this.votes = votes;
        this.participants = participants;
        this.users = users;
    }

    public List<ParticipantRatingRow> buildParticipantRating() {
        List<Vote> allVotes = votes.findAll();
        if (allVotes.isEmpty()) return List.of();

        // Тут делаем простую штуку: берём все голоса и складываем оценки в “корзинки” по participantId.
        // Так дальше проще посчитать средний балл и не держать в голове кучу условий.
        Map<Long, List<Integer>> scoresByParticipant = new HashMap<>();
        for (Vote v : allVotes) {
            scoresByParticipant
                    .computeIfAbsent(v.getParticipantId(), k -> new ArrayList<>())
                    .add(v.getScore());
        }

        // Участников вытягиваем одним заходом, чтобы не получилось “по запросу на каждый голос”.
        // На маленькой базе не заметно, а на большой быстро станет больно.
        Set<Long> participantIds = scoresByParticipant.keySet();
        Map<Long, Participant> participantMap = participants.findAllById(participantIds).stream()
                .collect(Collectors.toMap(Participant::getId, p -> p));

        List<ParticipantRatingRow> result = new ArrayList<>();

        for (var entry : scoresByParticipant.entrySet()) {
            Long participantId = entry.getKey();
            List<Integer> scores = entry.getValue();

            Participant p = participantMap.get(participantId);
            if (p == null) continue; // если участника уже удалили, просто пропускаем

            // Считаем средний балл по всем оценкам (пока без разбивки по номинациям).
            double avg = scores.stream().mapToInt(x -> x).average().orElse(0.0);

            result.add(new ParticipantRatingRow(
                    p.getId(),
                    p.getFio(),
                    p.getEmail(),
                    round(avg, 2)
            ));
        }

        // Чтобы рейтинг выглядел как рейтинг: сначала самые сильные, потом остальные.
        result.sort((a, b) -> Double.compare(b.points(), a.points()));
        return result;
    }

    public List<VoteRow> buildVotesList() {
        List<Vote> allVotes = votes.findAll();
        if (allVotes.isEmpty()) return List.of();

        // Собираем ids, которые нам понадобятся, и снова достаём всё пачкой.
        // Иначе будет классическое “N+1 запросов”, которое потом лечить неприятно.
        Set<Long> participantIds = allVotes.stream()
                .map(Vote::getParticipantId)
                .collect(Collectors.toSet());

        Set<Long> juryIds = allVotes.stream()
                .map(Vote::getJuryId)
                .collect(Collectors.toSet());

        Map<Long, Participant> participantMap = participants.findAllById(participantIds).stream()
                .collect(Collectors.toMap(Participant::getId, p -> p));

        Map<Long, User> juryMap = users.findAllById(juryIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        // Делаем удобный “плоский” список, который фронту проще показывать в таблице.
        List<VoteRow> result = new ArrayList<>();
        for (Vote v : allVotes) {
            Participant p = participantMap.get(v.getParticipantId());
            User jury = juryMap.get(v.getJuryId());

            result.add(new VoteRow(
                    v.getId(),
                    v.getNomination(),
                    v.getScore(),
                    v.getParticipantId(),
                    p == null ? "" : p.getFio(),
                    p == null ? "" : p.getEmail(),
                    v.getJuryId(),
                    jury == null ? "" : jury.getLogin()
            ));
        }

        // Сортируем стабильно по id, чтобы список не “прыгал” между обновлениями.
        result.sort(Comparator.comparingLong(VoteRow::id));
        return result;
    }

    private static double round(double value, int digits) {
        double k = Math.pow(10, digits);
        return Math.round(value * k) / k;
    }

    public record ParticipantRatingRow(Long id, String fio, String email, double points) {}

    public record VoteRow(
            Long id,
            Integer nominationId,
            Integer score,
            Long participantId,
            String participantFio,
            String participantEmail,
            Long juryId,
            String juryLogin
    ) {}
}
