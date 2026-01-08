package com.classroom.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeSubmissionRequest {
    private String grade;
    private String feedback;
}

