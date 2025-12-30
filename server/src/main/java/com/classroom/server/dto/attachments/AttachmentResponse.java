package com.classroom.server.dto.attachments;

import lombok.Data;

@Data
public class AttachmentResponse {

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
}
