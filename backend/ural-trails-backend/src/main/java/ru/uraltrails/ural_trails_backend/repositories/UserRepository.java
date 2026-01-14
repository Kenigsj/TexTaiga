package ru.uraltrails.ural_trails_backend.repositories;

import ru.uraltrails.ural_trails_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

// Репозиторий для работы с таблицей users.
// Через него мы вообще всё делаем с пользователями: ищем, создаём, обновляем, удаляем.
public interface UserRepository extends JpaRepository<User, Long> {

    // Ищем пользователя по логину.
    // Используется при авторизации, регистрации и валидации токена.
    // По сути, это основной способ понять, существует ли пользователь в системе.
    User findByLogin(String login);
}
