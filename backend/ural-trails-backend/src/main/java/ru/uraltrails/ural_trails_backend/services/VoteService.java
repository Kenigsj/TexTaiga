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
        Vote vote = voteRepository.findByJuryIdAndParticipantIdAndNomination(juryId, participantId, nomination);

        if (vote == null) {
            vote = new Vote();
            vote.setJuryId(juryId);
            vote.setParticipantId(participantId);
            vote.setNomination(nomination);
        }

        vote.setScore(score);
        return voteRepository.save(vote);
    }
}
