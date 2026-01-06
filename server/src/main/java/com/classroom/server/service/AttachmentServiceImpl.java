package com.classroom.server.service;

import com.classroom.server.entity.*;
import com.classroom.server.repository.AttachmentRepository;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final FileStorageService fileStorageService;
    private final CourseMemberRepository courseMemberRepository;
    @Override
    public void saveAttachments(
            Announcement announcement,
            List<MultipartFile> files
    ) {
        for (MultipartFile file : files) {

            String storagePath = fileStorageService.save(
                    file,
                    announcement.getId() // ONLY announcement ID
            );

            Attachment attachment = new Attachment();
            attachment.setAnnouncement(announcement);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setStoragePath(storagePath);

            attachmentRepository.save(attachment);
        }
    }

    @Override
    public Attachment getAttachment(Long attachmentId, User requester) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        courseMemberRepository.findByCourseAndUser(
                attachment.getAnnouncement().getCourse(),
                requester
        ).orElseThrow(() -> new RuntimeException("Access denied"));

        return attachment;
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadAttachment(Long attachmentId) {

        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        return fileStorageService.load(attachment.getStoragePath());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attachment> getAttachmentsForAnnouncement(Announcement announcement) {
        return attachmentRepository.findByAnnouncement(announcement);
    }
}
