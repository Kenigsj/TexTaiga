package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nominations")
@Data
public class Nomination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String title;
}
