package ru.uraltrails.ural_trails_backend.repositories;

import ru.uraltrails.ural_trails_backend.models.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}
