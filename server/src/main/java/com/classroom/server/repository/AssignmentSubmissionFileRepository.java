package com.classroom.server.repository;

import com.classroom.server.entity.AssignmentSubmission;
import com.classroom.server.entity.AssignmentSubmissionFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentSubmissionFileRepository
        extends JpaRepository<AssignmentSubmissionFile, Long> {

    List<AssignmentSubmissionFile> findBySubmission(AssignmentSubmission submission);

    void deleteBySubmission(AssignmentSubmission submission);
}
