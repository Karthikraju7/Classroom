package com.classroom.server.dto.messages;

import lombok.Data;
import java.util.List;

@Data
public class SendMessageRequest {

    private String content;

    // Used only when sender is TEACHER
    private List<Long> recipientIds;

    // 🔑 THREAD SUPPORT
    // null  -> new topic
    // value -> reply in same thread
    private Long threadId;
}
