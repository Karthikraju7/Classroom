package com.classroom.server.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(
        name = "message_recipients",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_message_recipient",
                        columnNames = {"message_id", "recipient_id"}
                )
        },
        indexes = {
                @Index(name = "idx_recipient", columnList = "recipient_id")
        }
)
public class MessageRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(name = "read_at")
    private LocalDateTime readAt; // null = unread
}

