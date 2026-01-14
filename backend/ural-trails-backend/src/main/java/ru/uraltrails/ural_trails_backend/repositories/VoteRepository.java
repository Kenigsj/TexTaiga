package ru.uraltrails.ural_trails_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.uraltrails.ural_trails_backend.models.Vote;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    List<Vote> findByParticipantId(Long participantId);
    List<Vote> findByJuryId(Long juryId);
    List<Vote> findByNomination(Integer nomination);

    // Ищу одну конкретную оценку:
    // Жюри X → Участник Y → Номинация Z
    Vote findByJuryIdAndParticipantIdAndNomination(Long juryId, Long participantId, Integer nomination);
}
