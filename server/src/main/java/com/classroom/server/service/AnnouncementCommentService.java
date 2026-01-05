package com.classroom.server.service;

import com.classroom.server.dto.announcementComments.AnnouncementCommentResponse;
import com.classroom.server.entity.AnnouncementComment;

import java.util.List;

public interface AnnouncementCommentService {

    AnnouncementCommentResponse addComment(
            Long announcementId,
            Long userId,
            String content
    );

    List<AnnouncementCommentResponse> getCommentsForAnnouncement(
            Long announcementId
    );
}
