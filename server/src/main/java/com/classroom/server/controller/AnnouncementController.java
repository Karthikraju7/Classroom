package com.classroom.server.controller;

import com.classroom.server.dto.announcements.AnnouncementRequest;
import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.User;
import com.classroom.server.repository.CourseRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.AnnouncementService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Announcement createAnnouncement(
            @RequestPart("data") String data,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws Exception {

        AnnouncementRequest request =
                objectMapper.readValue(data, AnnouncementRequest.class);

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return announcementService.createAnnouncement(
                course,
                user,
                request.getType(),
                request.getTitle(),
                request.getContent(),
                request.getDueDate(),
                files
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
