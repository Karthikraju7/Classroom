package com.classroom.server.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @Column(name = "file_name", nullable = false)
    private String fileName;   // original name shown to users

    @Column(name = "storage_path", nullable = false)
    private String storagePath;
    // local disk path OR key (future-proof)

    @Column(name = "file_type", nullable = false)
    private String fileType;   // application/pdf

    @Column(name = "file_size", nullable = false)
    private Long fileSize;     // bytes

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    public void onUpload() {
        this.uploadedAt = LocalDateTime.now();
    }
}
