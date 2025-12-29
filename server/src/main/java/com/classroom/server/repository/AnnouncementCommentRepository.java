package com.classroom.server.repository;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementCommentRepository
        extends JpaRepository<AnnouncementComment, Long> {

    List<AnnouncementComment> findByAnnouncementOrderByCreatedAtAsc(
            Announcement announcement
    );
}
