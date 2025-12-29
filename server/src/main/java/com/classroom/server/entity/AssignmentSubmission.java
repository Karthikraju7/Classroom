package com.classroom.server.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(
        name = "assignment_submissions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_assignment_student",
                        columnNames = {"announcement_id", "student_id"}
                )
        }
)
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Assignment = Announcement with type ASSIGNMENT
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(columnDefinition = "TEXT")
    private String content;          // text submission (optional)

    @Column(name = "file_path")
    private String filePath;         // local storage path (optional)

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column
    private String grade;             // optional

    @Column(columnDefinition = "TEXT")
    private String feedback;          // optional

    @PrePersist
    public void onSubmit() {
        this.submittedAt = LocalDateTime.now();
    }
}
