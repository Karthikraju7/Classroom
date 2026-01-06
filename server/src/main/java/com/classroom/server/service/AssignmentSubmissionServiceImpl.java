package com.classroom.server.service;

import com.classroom.server.entity.*;
import com.classroom.server.repository.AssignmentSubmissionFileRepository;
import com.classroom.server.repository.AssignmentSubmissionRepository;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentSubmissionServiceImpl implements AssignmentSubmissionService {

    private final AssignmentSubmissionRepository submissionRepository;
    private final AssignmentSubmissionFileRepository fileRepository;
    private final CourseMemberRepository courseMemberRepository;
    private final FileStorageService fileStorageService;

    @Override
    public AssignmentSubmission submitAssignment(
            Announcement assignment,
            User student,
            MultipartFile[] files
    ) {

        if (assignment.getType() != AnnouncementType.ASSIGNMENT) {
            throw new RuntimeException("Not an assignment");
        }

        CourseMember member = courseMemberRepository
                .findByCourseAndUser(assignment.getCourse(), student)
                .orElseThrow(() -> new RuntimeException("User not in course"));

        if (member.getRole() != CourseRole.STUDENT) {
            throw new RuntimeException("Only students can submit assignments");
        }

        submissionRepository
                .findByAnnouncementAndStudent(assignment, student)
                .ifPresent(s -> {
                    throw new RuntimeException("Assignment already submitted");
                });

        if (files == null || files.length == 0) {
            throw new RuntimeException("At least one file is required");
        }

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAnnouncement(assignment);
        submission.setStudent(student);

        submission = submissionRepository.save(submission);

        List<AssignmentSubmissionFile> savedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String path = fileStorageService.save(
                    file,
                    assignment.getId()
            );

            AssignmentSubmissionFile submissionFile =
                    new AssignmentSubmissionFile();

            submissionFile.setSubmission(submission);
            submissionFile.setFileName(file.getOriginalFilename());
            submissionFile.setFilePath(path);
            submissionFile.setFileType(file.getContentType());

            savedFiles.add(
                    fileRepository.save(submissionFile)
            );
        }

        submission.setFiles(savedFiles);

        return submission;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentSubmission> getSubmissionsForAssignment(
            Announcement assignment,
            User requester
    ) {

        CourseMember member = courseMemberRepository
                .findByCourseAndUser(assignment.getCourse(), requester)
                .orElseThrow(() -> new RuntimeException("User not in course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can view submissions");
        }

        return submissionRepository.findByAnnouncement(assignment);
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
                .findByCourseAndUser(
                        submission.getAnnouncement().getCourse(),
                        teacher
                )
                .orElseThrow(() -> new RuntimeException("User not in course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can grade");
        }

        submission.setGrade(grade);
        submission.setFeedback(feedback);

        return submissionRepository.save(submission);
    }
}
