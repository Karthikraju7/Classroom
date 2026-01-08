package com.classroom.server.service;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AssignmentSubmission;
import com.classroom.server.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AssignmentSubmissionService {

    AssignmentSubmission submitAssignment(
            Announcement assignment,
            User student,
            MultipartFile[] files
    );

    List<AssignmentSubmission> getSubmissionsForAssignment(
            Announcement assignment,
            User requester
    );

    AssignmentSubmission gradeSubmission(
            Long submissionId,
            User teacher,
            String grade,
            String feedback
    );

    AssignmentSubmission getMySubmission(
            Announcement assignment,
            User student
    );
}
