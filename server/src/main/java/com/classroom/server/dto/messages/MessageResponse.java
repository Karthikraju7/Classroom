package com.classroom.server.dto.messages;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public record MessageResponse(
        Long id,
        Long threadId,
        String content,
        Long senderId,
        String senderName,
        List<String> recipientNames,
        LocalDateTime createdAt
) {}

