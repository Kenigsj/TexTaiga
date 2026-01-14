package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
public class User {

    // обычный id пользователя в базе
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // логин для входа, уникальный, чтобы не было двух одинаковых аккаунтов
    @Column(nullable = false, unique = true)
    private String login;

    // пароль храним пока в обычном виде, без хеширования
    // для учебного проекта нормально, потом можно будет усложнить
    @Column(nullable = false)
    private String password;

    // роль пользователя: admin, moderator или jury
    // по ней дальше режется доступ ко всему функционалу
    @Column(nullable = false)
    private String role;

    // дата, когда аккаунт был зарегистрирован
    // чисто для информации в личном кабинете и в админке
    @Column(nullable = false)
    private LocalDate registeredDate;
}
