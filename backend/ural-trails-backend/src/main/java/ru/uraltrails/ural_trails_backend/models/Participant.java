package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "participants")
@Data
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    // здесь храню URL, по которому фронт может открыть картинку
    @Column(length = 5000)
    private String photoUrl;

    // сюда записываю номер номинации (1..4)
    private Integer nomination;
}
