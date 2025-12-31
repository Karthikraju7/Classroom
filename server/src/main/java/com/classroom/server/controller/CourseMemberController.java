package com.classroom.server.controller;

import com.classroom.server.dto.courseMember.CourseMemberResponse;
import com.classroom.server.service.CourseMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/courses/{courseId}/members")
@RequiredArgsConstructor
public class CourseMemberController {

    private final CourseMemberService courseMemberService;

    @GetMapping
    public List<CourseMemberResponse> getMembers(
            @PathVariable Long courseId
    ) {
        return courseMemberService.getMembers(courseId);
    }
}
