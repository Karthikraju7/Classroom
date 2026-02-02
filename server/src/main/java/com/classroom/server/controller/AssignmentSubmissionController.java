package com.classroom.server.controller;

import com.classroom.server.dto.AssignmentSubmissionResponse;
import com.classroom.server.dto.SubmissionFileResponse;
import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AssignmentSubmission;
import com.classroom.server.entity.User;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.AssignmentSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentSubmissionController {

    private final AssignmentSubmissionService submissionService;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @PostMapping(
            value = "/submit",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public AssignmentSubmissionResponse submit(
            @RequestParam Long announcementId,
            @RequestParam Long userId,
            @RequestParam("files") MultipartFile[] files
    ) {

        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AssignmentSubmission submission =
                submissionService.submitAssignment(
                        announcement,
                        user,
                        files
                );

        return map(submission);
    }

    @GetMapping("/{announcementId}/submissions")
    public List<AssignmentSubmissionResponse> getSubmissions(
            @PathVariable Long announcementId,
            @RequestParam Long userId
    ) {

        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return submissionService
                .getSubmissionsForAssignment(announcement, user)
                .stream()
                .map(this::map)
                .toList();
    }

    @GetMapping("/{announcementId}/my-submission")
    public AssignmentSubmissionResponse getMySubmission(
            @PathVariable Long announcementId,
            @RequestParam Long userId
    ) {

        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AssignmentSubmission submission =
                submissionService.getMySubmission(announcement, user);

        return submission == null ? null : map(submission);
    }

    @PutMapping("/submissions/{submissionId}/grade")
    public AssignmentSubmissionResponse grade(
            @PathVariable Long submissionId,
            @RequestParam Long userId,
            @RequestParam String grade,
            @RequestParam(required = false) String feedback
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AssignmentSubmission submission =
                submissionService.gradeSubmission(
                        submissionId,
                        user,
                        grade,
                        feedback
                );

        return map(submission);
    }

    private AssignmentSubmissionResponse map(AssignmentSubmission s) {
        return new AssignmentSubmissionResponse(
                s.getId(),
                s.getSubmittedAt(),
                s.getGrade(),
                s.getFeedback(),
                s.getStudent().getId(),
                s.getStudent().getName(),
                s.getFiles().stream()
                        .map(f -> new SubmissionFileResponse(
                                f.getId(),
                                f.getFileName(),
                                f.getFilePath()
                        ))
                        .toList()
        );
    }
}
