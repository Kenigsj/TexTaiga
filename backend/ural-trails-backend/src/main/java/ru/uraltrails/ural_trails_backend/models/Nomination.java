package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nominations")
@Data
public class Nomination {

    // обычный автоинкрементный id, по нему дальше всё связывается в базе
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // название номинации, делаем уникальным, чтобы не было двух одинаковых
    // длину поставил с запасом, чтобы потом не упереться в ограничения
    @Column(nullable = false, unique = true, length = 500)
    private String title;
}
