package com.classroom.server.controller;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AssignmentSubmission;
import com.classroom.server.entity.User;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.AssignmentSubmissionService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/submit")
    public AssignmentSubmission submit(
            @RequestParam Long announcementId,
            @RequestParam Long userId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile file
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return submissionService.submitAssignment(announcement, user, content, file);
    }

    @GetMapping("/{announcementId}/submissions")
    public List<AssignmentSubmission> getSubmissions(
            @PathVariable Long announcementId,
            @RequestParam Long userId
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return submissionService.getSubmissionsForAssignment(announcement, user);
    }
}
