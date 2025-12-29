package com.classroom.server.service;

import com.classroom.server.dto.course.CourseResponse;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.User;

import java.util.List;

public interface CourseService {

    Course createCourse(String name, String description, User creator);

    void joinCourse(Long courseId, User user);

    List<CourseResponse> getAllCoursesForUser(User user);

    List<CourseResponse> getCoursesWhereUserIsTeacher(User user);

    List<CourseResponse> getCoursesWhereUserIsStudent(User user);
}
