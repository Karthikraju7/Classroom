package com.classroom.server.service;

import com.classroom.server.dto.messages.SendMessageRequest;
import com.classroom.server.entity.Message;
import com.classroom.server.entity.User;

import java.util.List;

public interface MessageService {

    /**
     * Send new message or reply
     * - threadId == null → new thread
     * - threadId != null → reply
     */
    void send(Long courseId, User sender, SendMessageRequest request);

    /**
     * Inbox = one entry per thread (latest message of each thread)
     */
    List<Message> getThreadInbox(Long courseId, User user);

    /**
     * All messages (main + replies) of a thread
     */
    List<Message> getThreadMessages(Long courseId, Long threadId, User user);

    /**
     * Mark a single message as read (per recipient)
     */
    void markAsRead(Long messageId, User user);
}
