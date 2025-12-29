package com.classroom.server.service;

import com.classroom.server.entity.*;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.CourseMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final CourseMemberRepository courseMemberRepository;

    @Override
    public Announcement createAnnouncement(
            Course course,
            User author,
            AnnouncementType type,
            String title,
            String content,
            LocalDateTime dueDate
    ) {

        // 🔒 Only TEACHER can create
        CourseMember member = courseMemberRepository
                .findByCourseAndUser(course, author)
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        if (member.getRole() != CourseRole.TEACHER) {
            throw new RuntimeException("Only teachers can create announcements");
        }

        // assignment validation
        if (type == AnnouncementType.ASSIGNMENT && dueDate == null) {
            throw new RuntimeException("Assignment must have due date");
        }

        Announcement announcement = new Announcement();
        announcement.setCourse(course);
        announcement.setAuthor(author);
        announcement.setType(type);
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setDueDate(type == AnnouncementType.ASSIGNMENT ? dueDate : null);

        return announcementRepository.save(announcement);
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
