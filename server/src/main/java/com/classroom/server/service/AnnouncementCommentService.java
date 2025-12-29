package com.classroom.server.service;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementComment;
import com.classroom.server.entity.User;

import java.util.List;

public interface AnnouncementCommentService {

    AnnouncementComment addComment(
            Announcement announcement,
            User user,
            String content
    );

    List<AnnouncementComment> getCommentsForAnnouncement(
            Announcement announcement
    );
}
