package com.classroom.server.dto.courseMember;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseMemberResponse {
    private Long userId;
    private String userName;
    private String role;
}
