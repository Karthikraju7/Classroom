package com.classroom.server.repository;

import com.classroom.server.entity.LiveSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LiveSessionRepository extends JpaRepository<LiveSession, Long> {

    Optional<LiveSession> findByCourse_IdAndStatus(Long courseId, LiveSession.Status status);

    Optional<LiveSession> findByRoomId(String roomId);

}