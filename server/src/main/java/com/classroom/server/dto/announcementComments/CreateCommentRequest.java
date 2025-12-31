package com.classroom.server.dto.announcementComments;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private Long userId;   // TEMP → removed after JWT
    private String content;
}
