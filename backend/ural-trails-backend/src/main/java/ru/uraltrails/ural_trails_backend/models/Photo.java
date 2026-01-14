package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
public class Photo {

    // id самой записи в таблице photos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // id участника из таблицы participants, к которому относится это фото
    // по сути связываем фото и участника
    @Setter
    @Column(nullable = false)
    private Long participantId;

    // оригинальное имя файла, которое было у пользователя при загрузке
    // нужно больше для информации, чем для логики
    @Column(nullable = false)
    private String originalName;

    // имя файла, под которым мы реально сохранили его на сервере
    // обычно это UUID + расширение
    @Column(nullable = false)
    private String storedName;

    // полный путь к файлу на диске
    // по нему потом отдаём файл через PublicPhotoController
    @Column(nullable = false, length = 1000)
    private String filePath;

    // когда именно файл был загружен
    // удобно для отладки и сортировок, если понадобится
    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public Photo() {
        // пустой конструктор нужен JPA, руками почти никогда не используется
    }

    public Photo(Long participantId, String originalName, String storedName, String filePath) {
        // при создании фото сразу привязываем его к участнику
        this.participantId = participantId;

        // сохраняем, как файл назывался у пользователя
        this.originalName = originalName;

        // и как он теперь называется у нас на сервере
        this.storedName = storedName;

        // путь до файла, чтобы потом можно было его отдать
        this.filePath = filePath;

        // время загрузки ставим сразу автоматически
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getStoredName() {
        return storedName;
    }

    public void setStoredName(String storedName) {
        this.storedName = storedName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
