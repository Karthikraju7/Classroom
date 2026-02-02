import { useState } from "react";

function MessageItem({
  message,
  currentUserId,
  currentUserName,
  isThread = false,
  isInbox = false,
  isMain = false,
  isReply = false,
  onOpen,
  onRead,
}) {
  const isUnread = !message.readAt;
  const isSentByMe = message.senderId === currentUserId;
  const [hovered, setHovered] = useState(false);

  const senderLabel =
    message.senderId === currentUserId ? "You" : message.senderName;

  const recipientLabel = message.recipientNames
    ?.map((name) => (name === currentUserName ? "You" : name))
    .join(", ");

  function handleClick() {
    onRead?.(message.id);
    if (isThread) onOpen?.();
  }

  // Determine visual style based on role in thread
  let borderLeft = "none";
  let bgColor = "#ffffff";
  let cardBorder = "1px solid #e2e6ea";

  if (isMain) {
    borderLeft = "3px solid #2d5be3";
    bgColor = "#ffffff";
    cardBorder = "1px solid #d6e4fc";
  } else if (isReply && isSentByMe) {
    borderLeft = "3px solid #2d5be3";
    bgColor = "#eef2fc";
    cardBorder = "1px solid #d6e4fc";
  } else if (isReply && !isSentByMe) {
    borderLeft = "3px solid #d1d5db";
    bgColor = "#f8f9fb";
    cardBorder = "1px solid #e2e6ea";
  } else if (isInbox && isUnread) {
    bgColor = "#f0f4ff";
    cardBorder = "1px solid #d6e4fc";
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bgColor,
        border: cardBorder,
        borderLeft: borderLeft,
        borderRadius: "8px",
        padding: "14px 16px",
        cursor: isThread ? "pointer" : "default",
        transition: "box-shadow 0.15s ease, border-color 0.15s ease",
        boxShadow: (isThread && hovered) ? "0 2px 8px rgba(45, 91, 227, 0.1)" : "none",
      }}
    >
      {/* Top row: sender → recipient + unread dot */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {isUnread && isInbox && (
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#2d5be3", flexShrink: 0 }} />
          )}
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            <span style={{ fontWeight: "600", color: isSentByMe ? "#2d5be3" : "#374151" }}>{senderLabel}</span>
            <span style={{ color: "#9ca3af", margin: "0 5px" }}>→</span>
            <span style={{ color: "#6b7280" }}>{recipientLabel || "—"}</span>
          </span>
        </div>

        {isReply && (
          <span style={{
            fontSize: "10.5px",
            fontWeight: "600",
            color: isSentByMe ? "#2d5be3" : "#6b7280",
            backgroundColor: isSentByMe ? "#eef2fc" : "#f3f4f6",
            padding: "2px 7px",
            borderRadius: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}>
            {isSentByMe ? "You" : "Instructor"}
          </span>
        )}
      </div>

      {/* Message content */}
      <p style={{
        fontSize: "13.5px",
        color: "#1a1d23",
        margin: "0 0 8px",
        lineHeight: "1.55",
        wordBreak: "break-word",
      }}>
        {message.content}
      </p>

      {/* Footer: timestamp + thread indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11.5px", color: "#9ca3af" }}>
          {new Date(message.createdAt).toLocaleString()}
        </span>

        {isThread && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          }}>
            <span style={{ fontSize: "12px", color: "#2d5be3", fontWeight: "500" }}>View thread</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageItem;