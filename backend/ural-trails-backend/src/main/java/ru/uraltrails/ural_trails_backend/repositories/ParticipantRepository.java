package ru.uraltrails.ural_trails_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.uraltrails.ural_trails_backend.models.Participant;

import java.util.List;

// Репозиторий для таблицы participants.
// Через него мы получаем доступ ко всем загруженным фотографиям и участникам.
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    // Берём всех участников, которые относятся к конкретной номинации.
    // Это используется для модерации и для админки.
    List<Participant> findByNomination(Long nomination);

    // Берём участников по номинации, но только с нужным статусом.
    // В основном это нужно для жюри, чтобы они видели только одобренные работы.
    List<Participant> findByNominationAndStatus(Long nomination, String status);
}
