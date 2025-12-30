package com.classroom.server.controller;

import com.classroom.server.dto.attachments.AttachmentResponse;
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

import java.util.List;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    /**
     * View / stream a file (Google Classroom style)
     */
    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> view(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Attachment attachment = attachmentService.getAttachment(id, user);
        Resource resource = attachmentService.loadAttachment(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + attachment.getFileName() + "\""
                )
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .body(resource);
    }


    /**
     * List attachments for a given announcement
     */
    @GetMapping("/announcement/{announcementId}")
    public List<AttachmentResponse> list(
            @PathVariable Long announcementId
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        return attachmentService.getAttachmentsForAnnouncement(announcement)
                .stream()
                .map(a -> {
                    AttachmentResponse dto = new AttachmentResponse();
                    dto.setId(a.getId());
                    dto.setFileName(a.getFileName());
                    dto.setFileType(a.getFileType());
                    dto.setFileSize(a.getFileSize());
                    return dto;
                })
                .toList();
    }

}
