package com.classroom.server.service;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementComment;
import com.classroom.server.entity.CourseMember;
import com.classroom.server.entity.User;
import com.classroom.server.repository.AnnouncementCommentRepository;
import com.classroom.server.repository.CourseMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementCommentServiceImpl implements AnnouncementCommentService {

    private final AnnouncementCommentRepository commentRepository;
    private final CourseMemberRepository courseMemberRepository;

    @Override
    public AnnouncementComment addComment(
            Announcement announcement,
            User user,
            String content
    ) {

        // must be course member
        courseMemberRepository
                .findByCourseAndUser(announcement.getCourse(), user)
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        AnnouncementComment comment = new AnnouncementComment();
        comment.setAnnouncement(announcement);
        comment.setUser(user);
        comment.setContent(content);

        return commentRepository.save(comment);
    }

    @Override
    public List<AnnouncementComment> getCommentsForAnnouncement(
            Announcement announcement
    ) {
        return commentRepository
                .findByAnnouncementOrderByCreatedAtAsc(announcement);
    }
}
