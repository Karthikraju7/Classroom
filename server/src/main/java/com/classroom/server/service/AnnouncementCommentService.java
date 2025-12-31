package com.classroom.server.service;

import com.classroom.server.entity.AnnouncementComment;

import java.util.List;

public interface AnnouncementCommentService {

    AnnouncementComment addComment(
            Long announcementId,
            Long userId,
            String content
    );

    List<AnnouncementComment> getCommentsForAnnouncement(
            Long announcementId
    );
}
