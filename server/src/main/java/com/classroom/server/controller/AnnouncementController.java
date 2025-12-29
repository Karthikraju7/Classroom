package com.classroom.server.controller;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementType;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.User;
import com.classroom.server.repository.CourseRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Announcement createAnnouncement(
            @RequestParam Long courseId,
            @RequestParam Long userId,
            @RequestParam AnnouncementType type,
            @RequestParam String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) LocalDateTime dueDate
    ) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return announcementService.createAnnouncement(
                course, user, type, title, content, dueDate
        );
    }

    @GetMapping("/course/{courseId}")
    public List<Announcement> getAnnouncements(
            @PathVariable Long courseId
    ) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return announcementService.getAnnouncementsForCourse(course);
    }

    @GetMapping("/course/{courseId}/assignments")
    public List<Announcement> getAssignments(
            @PathVariable Long courseId
    ) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return announcementService.getAssignmentsForCourse(course);
    }
}
