package com.classroom.server.service;

import com.classroom.server.dto.messages.SendMessageRequest;
import com.classroom.server.entity.*;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.repository.MessageRecipientRepository;
import com.classroom.server.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final MessageRecipientRepository messageRecipientRepository;
    private final CourseMemberRepository courseMemberRepository;

    /**
     * Send new mail OR reply
     * - threadId == null → new thread
     * - threadId != null → reply in same thread
     */
    @Override
    public void send(Long courseId, User sender, SendMessageRequest request) {

        // 1️⃣ Sender must be part of course
        CourseMember senderMember = courseMemberRepository
                .findByCourseIdAndUserId(courseId, sender.getId())
                .orElseThrow(() -> new RuntimeException("Sender not part of course"));

        // 2️⃣ Create message (no threadId yet)
        Message message = new Message();
        message.setCourse(senderMember.getCourse());
        message.setSender(sender);
        message.setContent(request.getContent());

        // 3️⃣ Save to generate ID
        Message savedMessage = messageRepository.save(message);

        // 4️⃣ THREAD LOGIC
        if (request.getThreadId() == null) {
            // New topic
            savedMessage.setThreadId(savedMessage.getId());
        } else {
            // Reply
            savedMessage.setThreadId(request.getThreadId());
        }

        messageRepository.save(savedMessage);

        // 5️⃣ Resolve recipients based on role
        List<CourseMember> recipientMembers;

        if (senderMember.getRole() == CourseRole.STUDENT) {

            // STUDENT → only teachers
            recipientMembers = courseMemberRepository
                    .findByCourseIdAndRole(courseId, CourseRole.TEACHER);

            if (recipientMembers.isEmpty()) {
                throw new RuntimeException("No teacher found for course");
            }

        } else if (senderMember.getRole() == CourseRole.TEACHER) {

            // TEACHER → selected students
            if (request.getRecipientIds() == null || request.getRecipientIds().isEmpty()) {
                throw new RuntimeException("Teacher must select at least one student");
            }

            recipientMembers = courseMemberRepository
                    .findByCourseIdAndUser_IdInAndRole(
                            courseId,
                            request.getRecipientIds(),
                            CourseRole.STUDENT
                    );

            if (recipientMembers.size() != request.getRecipientIds().size()) {
                throw new RuntimeException("Invalid student recipients");
            }

        } else {
            throw new RuntimeException("Invalid role");
        }

        // 6️⃣ Save inbox entries
        for (CourseMember cm : recipientMembers) {
            MessageRecipient mr = new MessageRecipient();
            mr.setMessage(savedMessage);
            mr.setRecipient(cm.getUser());
            messageRecipientRepository.save(mr);
        }
    }

    /**
     * Inbox = ONE entry per thread (latest message of each thread)
     */
    @Override
    public List<Message> getThreadInbox(Long courseId, User user) {

        // 1️⃣ All messages received by user in course
        List<MessageRecipient> received = messageRecipientRepository
                .findByRecipientAndMessage_CourseId(user, courseId);

        // 2️⃣ Map: threadId -> latest message
        Map<Long, Message> latestByThread = new HashMap<>();

        for (MessageRecipient mr : received) {
            Message msg = mr.getMessage();
            Long threadId = msg.getThreadId();

            Message existing = latestByThread.get(threadId);
            if (existing == null || msg.getCreatedAt().isAfter(existing.getCreatedAt())) {
                latestByThread.put(threadId, msg);
            }
        }

        // 3️⃣ Sort latest messages by time desc (like inbox)
        return latestByThread.values().stream()
                .sorted(Comparator.comparing(Message::getCreatedAt).reversed())
                .toList();
    }

    /**
     * All messages (main + replies) of a thread
     */
    @Override
    public List<Message> getThreadMessages(Long courseId, Long threadId, User user) {

        // user must be part of course
        courseMemberRepository
                .findByCourseIdAndUserId(courseId, user.getId())
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        return messageRepository
                .findByCourseIdAndThreadIdOrderByCreatedAtAsc(courseId, threadId);
    }

    /**
     * Mark message as read (per recipient)
     */
    @Override
    public void markAsRead(Long messageId, User user) {

        MessageRecipient mr = messageRecipientRepository
                .findByMessageIdAndRecipientId(messageId, user.getId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (mr.getReadAt() == null) {
            mr.setReadAt(LocalDateTime.now());
        }
    }
}
