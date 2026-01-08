package com.classroom.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitAssignmentRequest {
    private Long announcementId;
    private String content;
}
