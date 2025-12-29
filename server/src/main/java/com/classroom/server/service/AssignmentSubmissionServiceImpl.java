package com.classroom.server.service;

import com.classroom.server.entity.*;
import com.classroom.server.repository.AssignmentSubmissionRepository;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentSubmissionServiceImpl implements AssignmentSubmissionService {

    private final AssignmentSubmissionRepository submissionRepository;
    private final CourseMemberRepository courseMemberRepository;
    private final FileStorageService fileStorageService;

    @Override
    public AssignmentSubmission submitAssignment(
            Announcement assignment,
            User student,
            String content,
            MultipartFile file
    ) {

        // must be ASSIGNMENT
        if (assignment.getType() != AnnouncementType.ASSIGNMENT) {
            throw new RuntimeException("Not an assignment");
        }

        // must be STUDENT
        CourseMember member = courseMemberRepository
                .findByCourseAndUser(assignment.getCourse(), student)
                .orElseThrow(() -> new RuntimeException("User not in course"));

        if (member.getRole() != CourseRole.STUDENT) {
            throw new RuntimeException("Only students can submit assignments");
        }

        // one submission per student
        submissionRepository
                .findByAnnouncementAndStudent(assignment, student)
                .ifPresent(s -> {
                    throw new RuntimeException("Assignment already submitted");
                });

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAnnouncement(assignment);
        submission.setStudent(student);
        submission.setContent(content);

        if (file != null && !file.isEmpty()) {
            String path = fileStorageService.save(
                    file,
                    assignment.getCourse().getId(),
                    assignment.getId()
            );
            submission.setFilePath(path);
        }

        return submissionRepository.save(submission);
    }

    @Override
    public List<AssignmentSubmission> getSubmissionsForAssignment(
            Announcement assignment,
            User requester
    ) {

        // only teacher can view all submissions
        CourseMember member = courseMemberRepository
                .findByCourseAndUser(assignment.getCourse(), requester)
                .orElseThrow(() -> new RuntimeException("User not in course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can view submissions");
        }

        return submissionRepository.findAll()
                .stream()
                .filter(s -> s.getAnnouncement().equals(assignment))
                .toList();
        //List<AssignmentSubmission> findByAnnouncement(Announcement announcement);
    }

    @Override
    public AssignmentSubmission gradeSubmission(
            Long submissionId,
            User teacher,
            String grade,
            String feedback
    ) {

        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        CourseMember member = courseMemberRepository
                .findByCourseAndUser(submission.getAnnouncement().getCourse(), teacher)
                .orElseThrow(() -> new RuntimeException("User not in course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can grade");
        }

        submission.setGrade(grade);
        submission.setFeedback(feedback);

        return submissionRepository.save(submission);
    }
}
