package ru.uraltrails.ural_trails_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.uraltrails.ural_trails_backend.models.Nomination;

// Репозиторий для работы с таблицей nominations.
// Тут лежат все стандартные методы: findAll, findById, save, delete и т.д.
public interface NominationRepository extends JpaRepository<Nomination, Long> {

    // Проверяем, есть ли уже номинация с таким названием.
    // Нужно, чтобы не дать создать две одинаковые номинации.
    boolean existsByTitle(String title);
}
