package com.classroom.server.controller;

import com.classroom.server.dto.live.LiveSessionResponse;
import com.classroom.server.entity.LiveSession;
import com.classroom.server.service.LiveSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/live")
@CrossOrigin
public class LiveSessionController {

    @Autowired
    private LiveSessionService liveSessionService;

    @PostMapping("/start/{courseId}")
    public LiveSessionResponse startSession(
            @PathVariable Long courseId,
            @RequestParam Long userId
    ) {
        LiveSession session = liveSessionService.startSession(courseId, userId);
        return liveSessionService.mapToResponse(session);
    }

    @GetMapping("/active/{courseId}")
    public LiveSessionResponse getActiveSession(@PathVariable Long courseId) {
        return liveSessionService.getActiveSession(courseId)
                .map(liveSessionService::mapToResponse)
                .orElse(null);
    }

    @PostMapping("/end/{roomId}")
    public void endSession(
            @PathVariable String roomId,
            @RequestParam Long userId
    ) {
        liveSessionService.endSession(roomId, userId);
    }
}