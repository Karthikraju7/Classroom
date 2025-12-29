package com.classroom.server.controller;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.Attachment;
import com.classroom.server.entity.User;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public Attachment upload(
            @RequestParam Long announcementId,
            @RequestParam Long userId,
            @RequestParam MultipartFile file
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attachmentService.uploadAttachment(announcement, file, user);
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> view(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = attachmentService.loadAttachment(id, user);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @GetMapping("/announcement/{announcementId}")
    public List<Attachment> list(
            @PathVariable Long announcementId
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        return attachmentService.getAttachmentsForAnnouncement(announcement);
    }
}
