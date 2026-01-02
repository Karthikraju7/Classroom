package com.classroom.server.repository;

import com.classroom.server.entity.Course;
import com.classroom.server.entity.Message;
import com.classroom.server.entity.MessageRecipient;
import com.classroom.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRecipientRepository
        extends JpaRepository<MessageRecipient, Long> {

    List<MessageRecipient> findByRecipient(User recipient);

    List<MessageRecipient> findByMessage(Message message);

    List<MessageRecipient> findByRecipientAndMessage_CourseId(User recipient, Long courseId);

    Optional<MessageRecipient> findByMessageIdAndRecipientId(Long messageId, Long recipientId);

}
