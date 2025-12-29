package com.classroom.server.service;

import com.classroom.server.entity.*;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.repository.MessageRecipientRepository;
import com.classroom.server.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final MessageRecipientRepository recipientRepository;
    private final CourseMemberRepository courseMemberRepository;

    @Override
    public Message sendMessage(
            Course course,
            User sender,
            List<User> recipients,
            String content
    ) {

        // sender must be part of course
        CourseMember senderMember = courseMemberRepository
                .findByCourseAndUser(course, sender)
                .orElseThrow(() -> new RuntimeException("Sender not in course"));

        Message message = new Message();
        message.setCourse(course);
        message.setSender(sender);
        message.setContent(content);

        Message savedMessage = messageRepository.save(message);

        for (User recipient : recipients) {

            CourseMember recipientMember = courseMemberRepository
                    .findByCourseAndUser(course, recipient)
                    .orElseThrow(() -> new RuntimeException("Recipient not in course"));

            // STUDENT → only TEACHER
            if (senderMember.getRole() == CourseRole.STUDENT &&
                    recipientMember.getRole() != CourseRole.TEACHER) {
                throw new RuntimeException("Students can message only teachers");
            }

            // TEACHER → only STUDENT
            if (senderMember.getRole() == CourseRole.TEACHER &&
                    recipientMember.getRole() != CourseRole.STUDENT) {
                throw new RuntimeException("Teachers can message only students");
            }

            MessageRecipient mr = new MessageRecipient();
            mr.setMessage(savedMessage);
            mr.setRecipient(recipient);

            recipientRepository.save(mr);
        }

        return savedMessage;
    }

    @Override
    public List<Message> getMessagesForUser(User user) {

        return recipientRepository.findByRecipient(user)
                .stream()
                .map(MessageRecipient::getMessage)
                .toList();
    }

    @Override
    public void markAsRead(Long messageId, User user) {

        MessageRecipient mr = recipientRepository.findByRecipient(user)
                .stream()
                .filter(r -> r.getMessage().getId().equals(messageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Message not found"));

        mr.setReadAt(LocalDateTime.now());
        recipientRepository.save(mr);
    }
}
