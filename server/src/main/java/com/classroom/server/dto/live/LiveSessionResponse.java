package com.classroom.server.dto.live;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LiveSessionResponse {

    private Long id;
    private Long courseId;
    private String roomId;
    private String status;
    private LocalDateTime startedAt;
}