package com.classroom.server.repository;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AssignmentSubmission;
import com.classroom.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository
        extends JpaRepository<AssignmentSubmission, Long> {

    // one submission per student per assignment
    Optional<AssignmentSubmission> findByAnnouncementAndStudent(
            Announcement announcement,
            User student
    );

    // teacher views all submissions for an assignment
    List<AssignmentSubmission> findByAnnouncement(
            Announcement announcement
    );
}
