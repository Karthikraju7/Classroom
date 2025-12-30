package com.classroom.server.dto.course;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String name;
    private String description;
    private String role;
}
