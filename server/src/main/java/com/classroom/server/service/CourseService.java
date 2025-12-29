package com.classroom.server.service;

import com.classroom.server.entity.Course;
import com.classroom.server.entity.User;

import java.util.List;

public interface CourseService {

    Course createCourse(String name, String description, User creator);

    void joinCourse(Long courseId, User user);

    List<Course> getAllCoursesForUser(User user);

    List<Course> getCoursesWhereUserIsTeacher(User user);

    List<Course> getCoursesWhereUserIsStudent(User user);
}
