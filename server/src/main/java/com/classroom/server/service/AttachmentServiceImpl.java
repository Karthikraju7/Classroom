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
    private final CourseMemberRepository courseMemberRepository;
    private final FileStorageService fileStorageService;

    @Override
    public Attachment uploadAttachment(
            Announcement announcement,
            MultipartFile file,
            User uploader
    ) {

        // 🔒 Only TEACHER can upload
        CourseMember member = courseMemberRepository
                .findByCourseAndUser(announcement.getCourse(), uploader)
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can upload attachments");
        }

        String storagePath = fileStorageService.save(
                file,
                announcement.getCourse().getId(),
                announcement.getId()
        );

        Attachment attachment = new Attachment();
        attachment.setAnnouncement(announcement);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setStoragePath(storagePath);

        return attachmentRepository.save(attachment);
    }

    @Override
    public Resource loadAttachment(Long attachmentId, User requester) {

        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        // 🔒 Must be course member to view
        courseMemberRepository.findByCourseAndUser(
                attachment.getAnnouncement().getCourse(),
                requester
        ).orElseThrow(() -> new RuntimeException("Access denied"));

        return fileStorageService.load(attachment.getStoragePath());
    }

    @Override
    public List<Attachment> getAttachmentsForAnnouncement(Announcement announcement) {
        return attachmentRepository.findByAnnouncement(announcement);
    }
}
