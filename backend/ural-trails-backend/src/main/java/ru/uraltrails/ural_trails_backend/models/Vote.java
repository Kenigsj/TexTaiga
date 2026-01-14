package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "votes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vote {

    // обычный id записи в таблице, нужен просто для базы
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // id пользователя из жюри, который поставил оценку
    // по нему потом можно понять, кто именно голосовал
    @Column(nullable = false)
    private Long juryId;

    // id участника (фотографии), которому поставили оценку
    @Column(nullable = false)
    private Long participantId;

    // id номинации, в рамках которой была поставлена оценка
    // важно, потому что одна и та же фотка теоретически может участвовать в разных номинациях
    @Column(nullable = false)
    private Integer nomination;

    // сама оценка, от 1 до 10
    @Column(nullable = false)
    private Integer score;
}
