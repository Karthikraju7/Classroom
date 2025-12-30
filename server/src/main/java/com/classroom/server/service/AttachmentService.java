package com.classroom.server.service;

import com.classroom.server.entity.Attachment;
import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {

    // INTERNAL use only (called from AnnouncementService)
    void saveAttachments(
            Announcement announcement,
            List<MultipartFile> files
    );

    // Stream file for viewing/downloading
    Resource loadAttachment(Long attachmentId);

    Attachment getAttachment(Long attachmentId, User requester);

    // Used when loading announcement details
    List<Attachment> getAttachmentsForAnnouncement(Announcement announcement);
}
