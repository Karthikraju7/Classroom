package com.classroom.server.dto.announcementComments;

import java.time.LocalDateTime;

public record AnnouncementCommentResponse(
        Long id,
        String content,
        LocalDateTime createdAt,
        Long authorId,
        String authorName
) {}

