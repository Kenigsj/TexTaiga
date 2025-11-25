package ru.uraltrails.ural_trails_backend.repositories;

import ru.uraltrails.ural_trails_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByLogin(String login);
}