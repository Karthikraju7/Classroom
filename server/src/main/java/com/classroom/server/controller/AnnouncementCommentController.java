package com.classroom.server.controller;

import com.classroom.server.dto.announcementComments.AnnouncementCommentResponse;
import com.classroom.server.dto.announcementComments.CreateCommentRequest;
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

    @PostMapping
    public AnnouncementCommentResponse add(
            @PathVariable Long announcementId,
            @RequestBody CreateCommentRequest request
    ) {
        return commentService.addComment(
                announcementId,
                request.getUserId(),
                request.getContent()
        );
    }

    @GetMapping
    public List<AnnouncementCommentResponse> get(
            @PathVariable Long announcementId
    ) {
        return commentService.getCommentsForAnnouncement(announcementId);
    }
}
