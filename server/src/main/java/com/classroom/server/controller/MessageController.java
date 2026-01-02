package com.classroom.server.controller;

import com.classroom.server.dto.messages.SendMessageRequest;
import com.classroom.server.entity.Message;
import com.classroom.server.entity.User;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/courses/{courseId}/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    /**
     * Send new message OR reply
     * - threadId == null → new thread
     * - threadId != null → reply
     */
    @PostMapping
    public void sendMessage(
            @PathVariable Long courseId,
            @RequestParam Long userId,   // TEMP
            @RequestBody SendMessageRequest request
    ) {
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        messageService.send(courseId, sender, request);
    }

    /**
     * THREAD INBOX
     * One entry per thread (latest message)
     */
    @GetMapping("/inbox")
    public List<Message> threadInbox(
            @PathVariable Long courseId,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return messageService.getThreadInbox(courseId, user);
    }

    /**
     * THREAD DETAILS (main message + replies)
     */
    @GetMapping("/thread/{threadId}")
    public List<Message> threadMessages(
            @PathVariable Long courseId,
            @PathVariable Long threadId,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return messageService.getThreadMessages(courseId, threadId, user);
    }

    /**
     * Mark a message as read
     */
    @PostMapping("/{messageId}/read")
    public void markRead(
            @PathVariable Long courseId,
            @PathVariable Long messageId,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        messageService.markAsRead(messageId, user);
    }
}
