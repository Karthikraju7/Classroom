package com.classroom.server.dto.messages;

import lombok.Data;
import java.util.List;

@Data
public class SendMessageRequest {

    private String content;
    private List<Long> recipientIds;
    private Long threadId;
}
