package com.classroom.server.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class SignalingController {

    private final SimpMessagingTemplate messagingTemplate;

    public SignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    //  JOIN ROOM (just notify others)
    @MessageMapping("/join")
    public void joinRoom(@Payload Map<String, Object> message) {
        String roomId = (String) message.get("roomId");

        messagingTemplate.convertAndSend(
                "/topic/" + roomId,
                message
        );
    }

    //OFFER (broadcast to room)
    @MessageMapping("/offer")
    public void handleOffer(@Payload Map<String, Object> message) {
        String roomId = (String) message.get("roomId");

        messagingTemplate.convertAndSend(
                "/topic/" + roomId,
                message
        );
    }

    //  ANSWER (broadcast to room)
    @MessageMapping("/answer")
    public void handleAnswer(@Payload Map<String, Object> message) {
        String roomId = (String) message.get("roomId");

        messagingTemplate.convertAndSend(
                "/topic/" + roomId,
                message
        );
    }

    // ICE CANDIDATE
    @MessageMapping("/ice")
    public void handleIce(@Payload Map<String, Object> message) {
        String roomId = (String) message.get("roomId");

        messagingTemplate.convertAndSend(
                "/topic/" + roomId,
                message
        );
    }

    //  LEAVE ROOM (optional but useful)
    @MessageMapping("/leave")
    public void leaveRoom(@Payload Map<String, Object> message) {
        String roomId = (String) message.get("roomId");

        messagingTemplate.convertAndSend(
                "/topic/" + roomId,
                message
        );
    }
}