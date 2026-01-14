package ru.uraltrails.ural_trails_backend.services;

import org.springframework.stereotype.Service;
import ru.uraltrails.ural_trails_backend.models.Vote;
import ru.uraltrails.ural_trails_backend.repositories.VoteRepository;

@Service
public class VoteService {

    private final VoteRepository voteRepository;

    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public Vote addVote(Long juryId, Long participantId, Integer nomination, Integer score) {
        // Сначала пытаемся найти голос, если это жюри уже голосовало за этого участника в этой номинации
        // Тогда мы просто обновим оценку, а не будем плодить новые строки в БД
        Vote vote = voteRepository.findByJuryIdAndParticipantIdAndNomination(juryId, participantId, nomination);

        if (vote == null) {
            // Если такого голоса ещё нет — значит жюри голосует первый раз
            // Создаём новую запись
            vote = new Vote();
            vote.setJuryId(juryId);
            vote.setParticipantId(participantId);
            vote.setNomination(nomination);
        }

        // Оценку всегда перезаписываем, чтобы можно было менять свой голос
        vote.setScore(score);

        // Сохраняем либо новый голос, либо обновлённый
        return voteRepository.save(vote);
    }
}
