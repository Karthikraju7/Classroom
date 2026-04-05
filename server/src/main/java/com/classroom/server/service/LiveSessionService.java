package com.classroom.server.service;

import com.classroom.server.dto.live.LiveSessionResponse;
import com.classroom.server.entity.Course;
import com.classroom.server.entity.LiveSession;
import com.classroom.server.repository.LiveSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class LiveSessionService {

    @Autowired
    private LiveSessionRepository liveSessionRepository;

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseMemberService courseMemberService;

    // START SESSION
    public LiveSession startSession(Long courseId, Long userId) {

        // ✅ check teacher FIRST
        boolean isTeacher = courseMemberService.isTeacher(courseId, userId);
        if (!isTeacher) {
            throw new RuntimeException("Only teacher can start session");
        }

        Optional<LiveSession> existing =
                liveSessionRepository.findByCourse_IdAndStatus(courseId, LiveSession.Status.ACTIVE);

        if (existing.isPresent()) {
            return existing.get();
        }

        Course course = courseService.getCourseEntityById(courseId);

        LiveSession session = new LiveSession();
        session.setCourse(course);
        session.setRoomId(UUID.randomUUID().toString());
        session.setStatus(LiveSession.Status.ACTIVE);

        return liveSessionRepository.save(session);
    }

    // GET ACTIVE SESSION
    public Optional<LiveSession> getActiveSession(Long courseId) {
        return liveSessionRepository.findByCourse_IdAndStatus(courseId, LiveSession.Status.ACTIVE);
    }

    // END SESSION
    public void endSession(String roomId, Long userId) {
        LiveSession session = liveSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Long courseId = session.getCourse().getId();

        boolean isTeacher = courseMemberService.isTeacher(courseId, userId);
        if (!isTeacher) {
            throw new RuntimeException("Only teacher can end session");
        }

        // ✅ FIX: actually end session
        session.setStatus(LiveSession.Status.ENDED);
        liveSessionRepository.save(session);
    }

    // MAPPING FUNCTION (ENTITY → DTO)
    public LiveSessionResponse mapToResponse(LiveSession session) {
        return new LiveSessionResponse(
                session.getId(),
                session.getCourse().getId(),
                session.getRoomId(),
                session.getStatus().name(),
                session.getStartedAt()
        );
    }
}