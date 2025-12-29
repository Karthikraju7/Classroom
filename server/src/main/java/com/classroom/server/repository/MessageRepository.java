package com.classroom.server.repository;

import com.classroom.server.entity.Course;
import com.classroom.server.entity.Message;
import com.classroom.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByCourseAndSender(Course course, User sender);
}
