package com.classroom.server.dto.announcements;

import com.classroom.server.entity.AnnouncementType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnnouncementRequest {

    private Long courseId;
    private Long userId;          // TEMP → later from JWT
    private AnnouncementType type;

    private String title;         // nullable
    private String content;       // nullable
    private LocalDateTime dueDate; // only for ASSIGNMENT
}
