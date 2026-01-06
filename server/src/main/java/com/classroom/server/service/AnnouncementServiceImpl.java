package com.classroom.server.service;

import com.classroom.server.entity.*;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.CourseMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final CourseMemberRepository courseMemberRepository;
    private final AttachmentService attachmentService; // NEW

    @Override
    public Announcement createAnnouncement(
            Course course,
            User author,
            AnnouncementType type,
            String title,
            String content,
            LocalDateTime dueDate,
            List<MultipartFile> files
    ) {

        CourseMember member = courseMemberRepository
                .findByCourseAndUser(course, author)
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can create announcements");
        }

        if (type == AnnouncementType.ASSIGNMENT && dueDate == null) {
            throw new RuntimeException("Assignment must have due date");
        }

        boolean hasText =
                (title != null && !title.isBlank()) ||
                        (content != null && !content.isBlank());

        boolean hasFiles = files != null && !files.isEmpty();

        if (!hasText && !hasFiles) {
            throw new RuntimeException("Announcement must have text or files");
        }

        // Create announcement first
        Announcement announcement = new Announcement();
        announcement.setCourse(course);
        announcement.setAuthor(author);
        announcement.setType(type);
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setDueDate(type == AnnouncementType.ASSIGNMENT ? dueDate : null);

        Announcement saved = announcementRepository.save(announcement);

        // Save files
        if (hasFiles) {
            attachmentService.saveAttachments(saved, files);
        }

        return saved;
    }

    @Override
    public List<Announcement> getAnnouncementsForCourse(Course course) {
        return announcementRepository.findByCourseOrderByCreatedAtDesc(course);
    }

    @Override
    public List<Announcement> getAssignmentsForCourse(Course course) {
        return announcementRepository.findByCourseAndType(
                course,
                AnnouncementType.ASSIGNMENT
        );
    }
}
