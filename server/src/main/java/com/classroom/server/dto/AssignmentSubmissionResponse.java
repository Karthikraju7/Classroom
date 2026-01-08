package com.classroom.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class AssignmentSubmissionResponse {
    private Long id;
    private LocalDateTime submittedAt;
    private String grade;
    private String feedback;
    private Long studentId;
    private String studentName;

    private List<SubmissionFileResponse> files;
}

