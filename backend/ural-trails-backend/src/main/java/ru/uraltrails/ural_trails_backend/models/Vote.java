package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "votes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long juryId; // id жюри

    @Column(nullable = false)
    private Long participantId; // участник

    @Column(nullable = false)
    private Integer nomination; // 1–4

    @Column(nullable = false)
    private Integer score; // 1–10
}
