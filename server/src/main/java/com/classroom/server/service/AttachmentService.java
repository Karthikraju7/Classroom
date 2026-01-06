package com.classroom.server.service;

import com.classroom.server.entity.Attachment;
import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {

    void saveAttachments(
            Announcement announcement,
            List<MultipartFile> files
    );
    Resource loadAttachment(Long attachmentId);

    Attachment getAttachment(Long attachmentId, User requester);
    List<Attachment> getAttachmentsForAnnouncement(Announcement announcement);
}
