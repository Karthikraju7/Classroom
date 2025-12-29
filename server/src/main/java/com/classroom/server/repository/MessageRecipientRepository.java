package com.classroom.server.repository;

import com.classroom.server.entity.Message;
import com.classroom.server.entity.MessageRecipient;
import com.classroom.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRecipientRepository
        extends JpaRepository<MessageRecipient, Long> {

    List<MessageRecipient> findByRecipient(User recipient);

    List<MessageRecipient> findByMessage(Message message);
}
