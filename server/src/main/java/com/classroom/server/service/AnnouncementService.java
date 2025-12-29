package com.classroom.server.service;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementType;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public interface AnnouncementService {

    Announcement createAnnouncement(
            Course course,
            User author,
            AnnouncementType type,
            String title,
            String content,
            LocalDateTime dueDate
    );

    List<Announcement> getAnnouncementsForCourse(Course course);

    List<Announcement> getAssignmentsForCourse(Course course);
}
