package ru.uraltrails.ural_trails_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.uraltrails.ural_trails_backend.models.Participant;

import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    // беру участников конкретной номинации
    List<Participant> findByNomination(Integer nomination);
}
