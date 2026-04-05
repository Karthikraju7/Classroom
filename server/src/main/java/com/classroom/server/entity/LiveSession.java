package com.classroom.server.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "live_sessions")
public class LiveSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // course reference (like Announcement)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "room_id", unique = true, nullable = false)
    private String roomId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    public enum Status {
        ACTIVE,
        ENDED
    }

    @PrePersist
    public void onCreate() {
        this.startedAt = LocalDateTime.now();
    }
}