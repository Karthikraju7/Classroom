package com.classroom.server.dto.announcements;

import com.classroom.server.entity.AnnouncementType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnnouncementRequest {

    private Long courseId;
    private Long userId;
    private AnnouncementType type;

    private String title;
    private String content;
    private LocalDateTime dueDate;
}
