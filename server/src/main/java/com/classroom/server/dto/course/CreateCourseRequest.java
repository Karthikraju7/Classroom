package com.classroom.server.dto.course;

import lombok.Data;

@Data
public class CreateCourseRequest {
    private String name;
    private String description;
    private Long userId;
}
