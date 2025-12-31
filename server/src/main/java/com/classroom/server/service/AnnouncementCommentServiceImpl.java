package com.classroom.server.service;

import com.classroom.server.entity.Announcement;
import com.classroom.server.entity.AnnouncementComment;
import com.classroom.server.entity.CourseMember;
import com.classroom.server.entity.User;
import com.classroom.server.repository.AnnouncementCommentRepository;
import com.classroom.server.repository.AnnouncementRepository;
import com.classroom.server.repository.CourseMemberRepository;
import com.classroom.server.repository.UserRepository;
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
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Override
    public AnnouncementComment addComment(
            Long announcementId,
            Long userId,
            String content
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // must be course member
        courseMemberRepository
                .findByCourseAndUser(announcement.getCourse(), user)
                .orElseThrow(() -> new RuntimeException("User not part of course"));

        // content validation
        if (content == null || content.isBlank()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        AnnouncementComment comment = new AnnouncementComment();
        comment.setAnnouncement(announcement);
        comment.setAuthor(user);
        comment.setContent(content);

        return commentRepository.save(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementComment> getCommentsForAnnouncement(
            Long announcementId
    ) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        return commentRepository
                .findByAnnouncementOrderByCreatedAtAsc(announcement);
    }
}
