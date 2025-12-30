package com.classroom.server.controller;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementComment;
import com.classroom.server.entity.User;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.AnnouncementCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcements/{announcementId}/comments")
@RequiredArgsConstructor
public class AnnouncementCommentController {

    private final AnnouncementCommentService commentService;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @PostMapping
    public AnnouncementComment add(
            @PathVariable Long announcementId,
            @RequestParam Long userId,   // TEMP → JWT later
            @RequestParam String content
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return commentService.addComment(announcement, user, content);
    }

    @GetMapping
    public List<AnnouncementComment> get(
            @PathVariable Long announcementId
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        return commentService.getCommentsForAnnouncement(announcement);
    }
}
