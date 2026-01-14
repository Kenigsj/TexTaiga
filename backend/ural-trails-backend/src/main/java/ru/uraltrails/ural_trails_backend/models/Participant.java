package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "participants")
@Data
public class Participant {

    // основной id участника, обычный автоинкремент
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // имя и фамилия по отдельности, могут пригодиться потом для сортировок или фильтров
    private String firstName;
    private String lastName;

    // ФИО одной строкой, как вводит пользователь
    // это то, что в первую очередь показываем на фронте
    @Column(nullable = false, length = 500)
    private String fio;

    // почта участника, нужна для контакта и для рейтинга
    @Column(nullable = false, length = 500)
    private String email;

    // ссылка на файл с фотографией
    // тут хранится уже готовый URL, который фронт просто подставляет в <img>
    @Column(length = 5000)
    private String photoUrl;

    // тут храним именно id номинации из таблицы nominations
    // не номер по порядку, а реальный id из БД
    private Long nomination;

    // статус работы: pending / approved / rejected
    // pending — ещё не проверена, approved — одобрена, rejected — отклонена
    @Column(nullable = false)
    private String status;

    // когда именно фото было загружено
    // полезно и для сортировки, и просто для админки
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
}
