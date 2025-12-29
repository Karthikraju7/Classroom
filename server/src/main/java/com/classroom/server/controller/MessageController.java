package com.classroom.server.controller;

import com.classroom.server.entity.Course;
import com.classroom.server.entity.Message;
import com.classroom.server.entity.User;
import com.classroom.server.repository.CourseRepository;
import com.classroom.server.repository.UserRepository;
import com.classroom.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Message send(
            @RequestParam Long courseId,
            @RequestParam Long senderId,
            @RequestBody List<Long> recipientIds,
            @RequestParam String content
    ) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> recipients = recipientIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .toList();

        return messageService.sendMessage(course, sender, recipients, content);
    }

    @GetMapping
    public List<Message> inbox(
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return messageService.getMessagesForUser(user);
    }

    @PostMapping("/{messageId}/read")
    public void markRead(
            @PathVariable Long messageId,
            @RequestParam Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        messageService.markAsRead(messageId, user);
    }
}
