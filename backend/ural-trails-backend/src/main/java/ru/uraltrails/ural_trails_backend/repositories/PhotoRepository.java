package ru.uraltrails.ural_trails_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.uraltrails.ural_trails_backend.models.Photo;

import java.util.List;

// Репозиторий для работы с таблицей photos.
// Тут лежит информация не о самом участнике, а именно о файлах,
// которые он загрузил (пути, имена, связь с participant).
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    // Получаем все фотографии, которые принадлежат конкретному участнику.
    // Это удобно, если потом появится поддержка нескольких фото от одного человека
    // или если нужно будет показать весь набор его работ.
    List<Photo> findByParticipantId(Long participantId);
}
