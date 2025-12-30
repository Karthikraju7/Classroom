package com.classroom.server.controller;

import com.classroom.server.dto.course.CourseResponse;
import com.classroom.server.dto.course.CreateCourseRequest;
import com.classroom.server.dto.course.JoinCourseRequest;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.User;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public Course createCourse(@RequestBody CreateCourseRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return courseService.createCourse(
                request.getName(),
                request.getDescription(),
                user
        );
    }

    @PostMapping("/{courseId}/join")
    public void joinCourse(
            @PathVariable Long courseId,
            @RequestBody JoinCourseRequest request
    ) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        courseService.joinCourse(courseId, user);
    }

    @GetMapping("/{courseId}")
    public CourseResponse getCourseById(
            @PathVariable Long courseId,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return courseService.getCourseByIdForUser(courseId, user);
    }


    @GetMapping
    public List<CourseResponse> getAllCourses(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return courseService.getAllCoursesForUser(user);
    }

    @GetMapping("/teacher")
    public List<CourseResponse> getTeacherCourses(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return courseService.getCoursesWhereUserIsTeacher(user);
    }

    @GetMapping("/student")
    public List<CourseResponse> getStudentCourses(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return courseService.getCoursesWhereUserIsStudent(user);
    }

}
