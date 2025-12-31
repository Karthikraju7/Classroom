package com.classroom.server.service;

import com.classroom.server.dto.courseMember.CourseMemberResponse;
import com.classroom.server.entity.Course;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseMemberService {

    private final CourseRepository courseRepository;
    private final CourseMemberRepository courseMemberRepository;

    public List<CourseMemberResponse> getMembers(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return courseMemberRepository.findByCourse(course)
                .stream()
                .map(cm -> new CourseMemberResponse(
                        cm.getUser().getId(),
                        cm.getUser().getName(),
                        cm.getRole().name()
                ))
                .toList();
    }
}
