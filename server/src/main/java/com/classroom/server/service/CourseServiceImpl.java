package com.classroom.server.service;

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
    public List<Course> getAllCoursesForUser(User user) {
        return courseMemberRepository.findByUser(user)
                .stream()
                .map(CourseMember::getCourse)
                .collect(Collectors.toList());
    }

    @Override
    public List<Course> getCoursesWhereUserIsTeacher(User user) {
        return courseMemberRepository.findByUserAndRole(user, CourseRole.TEACHER)
                .stream()
                .map(CourseMember::getCourse)
                .collect(Collectors.toList());
    }

    @Override
    public List<Course> getCoursesWhereUserIsStudent(User user) {
        return courseMemberRepository.findByUserAndRole(user, CourseRole.STUDENT)
                .stream()
                .map(CourseMember::getCourse)
                .collect(Collectors.toList());
    }
}
