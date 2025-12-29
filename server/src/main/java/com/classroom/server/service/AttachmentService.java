package com.classroom.server.service;

import com.classroom.server.entity.Attachment;
import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {

    Attachment uploadAttachment(
            Announcement announcement,
            MultipartFile file,
            User uploader
    );

    Resource loadAttachment(Long attachmentId, User requester);

    List<Attachment> getAttachmentsForAnnouncement(Announcement announcement);
}
