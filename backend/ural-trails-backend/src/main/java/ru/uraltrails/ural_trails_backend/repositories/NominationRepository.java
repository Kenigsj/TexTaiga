package ru.uraltrails.ural_trails_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.uraltrails.ural_trails_backend.models.Nomination;

public interface NominationRepository extends JpaRepository<Nomination, Long> {
    boolean existsByTitle(String title);
}
