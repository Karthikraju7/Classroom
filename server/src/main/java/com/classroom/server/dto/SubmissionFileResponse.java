package com.classroom.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubmissionFileResponse {
    private Long id;
    private String fileName;
    private String filePath;
}
