package com.classroom.server.service;

import com.classroom.server.dto.messages.MessageResponse;
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
    @Override
    public void send(Long courseId, User sender, SendMessageRequest request) {
        CourseMember senderMember = courseMemberRepository
                .findByCourseIdAndUserId(courseId, sender.getId())
                .orElseThrow(() -> new RuntimeException("Sender not part of course"));
        Message message = new Message();
        message.setCourse(senderMember.getCourse());
        message.setSender(sender);
        message.setContent(request.getContent());

        Message savedMessage = messageRepository.save(message);

        //THREAD
        if (request.getThreadId() == null) {
            // New topic
            savedMessage.setThreadId(savedMessage.getId());
        } else {
            // Reply
            savedMessage.setThreadId(request.getThreadId());
        }

        messageRepository.save(savedMessage);

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

        for (CourseMember cm : recipientMembers) {
            MessageRecipient mr = new MessageRecipient();
            mr.setMessage(savedMessage);
            mr.setRecipient(cm.getUser());
            messageRecipientRepository.save(mr);
        }
    }

    @Override
    public List<MessageResponse> getThreadInbox(Long courseId, User user){
        List<MessageRecipient> received =
                messageRecipientRepository.findByRecipientAndMessage_CourseId(user, courseId);

        List<Message> receivedMessages = received.stream()
                .map(MessageRecipient::getMessage)
                .toList();

        List<Message> sentMessages =
                messageRepository.findByCourseAndSender(
                        courseMemberRepository
                                .findByCourseIdAndUserId(courseId, user.getId())
                                .orElseThrow()
                                .getCourse(),
                        user
                );

        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(receivedMessages);
        allMessages.addAll(sentMessages);

        Map<Long, Message> mainByThread = new HashMap<>();
        Map<Long, LocalDateTime> latestActivity = new HashMap<>();

        for (Message msg : allMessages) {
            Long threadId = msg.getThreadId();
            if (threadId == null) continue;

            // Track latest activity time
            latestActivity.put(
                    threadId,
                    latestActivity.containsKey(threadId)
                            ? latestActivity.get(threadId).isAfter(msg.getCreatedAt())
                            ? latestActivity.get(threadId)
                            : msg.getCreatedAt()
                            : msg.getCreatedAt()
            );
            if (msg.getId().equals(threadId)) {
                mainByThread.put(threadId, msg);
            }
        }


        return mainByThread.values().stream()
                .sorted((a, b) ->
                        latestActivity.get(b.getThreadId())
                                .compareTo(latestActivity.get(a.getThreadId()))
                )
                .map(this::toResponse)
                .toList();

    }

    @Override
    public List<MessageResponse> getThreadMessages(Long courseId, Long threadId, User user) {

        courseMemberRepository
                .findByCourseIdAndUserId(courseId, user.getId())
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        return messageRepository
                .findByCourseIdAndThreadIdOrderByCreatedAtAsc(courseId, threadId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    @Override
    public void markAsRead(Long messageId, User user) {

        MessageRecipient mr = messageRecipientRepository
                .findByMessageIdAndRecipientId(messageId, user.getId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (mr.getReadAt() == null) {
            mr.setReadAt(LocalDateTime.now());
        }
    }
    private MessageResponse toResponse(Message m) {

        List<String> recipients =
                messageRecipientRepository.findByMessage(m)
                        .stream()
                        .map(mr -> mr.getRecipient().getName())
                        .toList();

        return new MessageResponse(
                m.getId(),
                m.getThreadId(),
                m.getContent(),
                m.getSender().getId(),
                m.getSender().getName(),
                recipients,
                m.getCreatedAt()
        );
    }


}
