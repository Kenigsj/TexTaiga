package ru.uraltrails.ural_trails_backend.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // к какому участнику относится
    @Column(nullable = false)
    private Long participantId;

    // как назывался файл у пользователя
    @Column(nullable = false)
    private String originalName;

    // как сохранил на диске (уникальное имя)
    @Column(nullable = false)
    private String storedName;

    // полный путь на диске
    @Column(nullable = false, length = 1000)
    private String filePath;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public Photo() {}

    public Photo(Long participantId, String originalName, String storedName, String filePath) {
        this.participantId = participantId;
        this.originalName = originalName;
        this.storedName = storedName;
        this.filePath = filePath;
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getStoredName() { return storedName; }
    public void setStoredName(String storedName) { this.storedName = storedName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
