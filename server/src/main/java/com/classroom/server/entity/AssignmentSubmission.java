package com.classroom.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @OneToMany(
            mappedBy = "submission",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<AssignmentSubmissionFile> files = new ArrayList<>();

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(length = 50)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @PrePersist
    public void onSubmit() {
        this.submittedAt = LocalDateTime.now();
    }
}
