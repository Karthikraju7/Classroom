package com.classroom.server.service;

import com.classroom.server.dto.course.CourseResponse;
import com.classroom.server.entity.*;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMemberRepository courseMemberRepository;

    @Override
    public Course createCourse(String name, String description, User creator) {

        Course course = new Course();
        course.setName(name);
        course.setDescription(description);
        course.setCreatedBy(creator);

        Course savedCourse = courseRepository.save(course);

        CourseMember member = new CourseMember();
        member.setCourse(savedCourse);
        member.setUser(creator);
        member.setRole(CourseRole.TEACHER);

        courseMemberRepository.save(member);

        return savedCourse;
    }

    @Override
    public void joinCourse(Long courseId, User user) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course does not exist"));

        if (courseMemberRepository.findByCourseAndUser(course, user).isPresent()) {
            throw new RuntimeException("User already joined this course");
        }

        CourseMember member = new CourseMember();
        member.setCourse(course);
        member.setUser(user);
        member.setRole(CourseRole.STUDENT);

        courseMemberRepository.save(member);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourseByIdForUser(Long courseId, User user) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found")
                );

        CourseMember member = courseMemberRepository
                .findByCourseAndUser(course, user)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.FORBIDDEN, "User not enrolled in course")
                );

        return new CourseResponse(
                course.getId(),
                course.getName(),
                course.getDescription(),
                member.getRole().name()
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCoursesForUser(User user) {
        return courseMemberRepository.findByUser(user)
                .stream()
                .map(cm -> {
                    Course c = cm.getCourse();
                    return new CourseResponse(
                            c.getId(),
                            c.getName(),
                            c.getDescription(),
                            cm.getRole().name()
                    );
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesWhereUserIsTeacher(User user) {
        return courseMemberRepository.findByUserAndRole(user, CourseRole.TEACHER)
                .stream()
                .map(cm -> {
                    Course c = cm.getCourse();
                    return new CourseResponse(
                            c.getId(),
                            c.getName(),
                            c.getDescription(),
                            CourseRole.TEACHER.name()
                    );
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesWhereUserIsStudent(User user) {
        return courseMemberRepository.findByUserAndRole(user, CourseRole.STUDENT)
                .stream()
                .map(cm -> {
                    Course c = cm.getCourse();
                    return new CourseResponse(
                            c.getId(),
                            c.getName(),
                            c.getDescription(),
                            CourseRole.STUDENT.name()
                    );
                })
                .toList();
    }

}
