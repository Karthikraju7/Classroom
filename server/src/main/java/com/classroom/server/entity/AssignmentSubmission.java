package com.classroom.server.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // multiple files
    @OneToMany(
            mappedBy = "submission",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<AssignmentSubmissionFile> files;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(length = 50)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @PrePersist
    void onSubmit() {
        this.submittedAt = LocalDateTime.now();
    }
}
