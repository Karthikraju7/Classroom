package com.classroom.server.repository;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.AnnouncementType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByCourseOrderByCreatedAtDesc(Course course);

    List<Announcement> findByCourseAndType(Course course, AnnouncementType type);
}

