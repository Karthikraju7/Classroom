package com.classroom.server.service;

import com.classroom.server.entity.Course;
import com.classroom.server.entity.Message;
import com.classroom.server.entity.User;

import java.util.List;

public interface MessageService {

    Message sendMessage(
            Course course,
            User sender,
            List<User> recipients,
            String content
    );

    List<Message> getMessagesForUser(User user);

    void markAsRead(Long messageId, User user);
}
