package com.classroom.server.repository;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByAnnouncement(Announcement announcement);
}
