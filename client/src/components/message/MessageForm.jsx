import { useState } from "react";

function MessageForm({
  students = [],
  isReply = false,
  onSend,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isReply && selectedIds.length === 0) {
      alert("Select at least one student");
      return;
    }

    onSend({
      content,
      recipientIds: isReply ? null : selectedIds,
    });

    setContent("");
    setSelectedIds([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e6ea",
        borderRadius: "10px",
        padding: "20px 22px",
      }}
    >
      {/* Form header */}
      <div style={{ marginBottom: isReply ? "12px" : "18px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.2px" }}>
          {isReply ? "Reply" : "New Message"}
        </h3>
        {!isReply && (
          <p style={{ fontSize: "12.5px", color: "#6b7280", margin: "3px 0 0" }}>
            Select recipients and write your message.
          </p>
        )}
      </div>

      {/* Recipient selector */}
      {!isReply && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
            To <span style={{ color: "#e53e3e" }}>*</span>
          </label>

          <div style={{
            border: "1.5px solid #d1d5db",
            borderRadius: "8px",
            padding: "10px 12px",
            maxHeight: "150px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            backgroundColor: "#fafbfc",
          }}>
            {students.map((s) => (
              <label
                key={s.userId}
                style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151", cursor: "pointer" }}
              >
                <div
                  onClick={() => {
                    setSelectedIds((prev) =>
                      prev.includes(s.userId)
                        ? prev.filter((id) => id !== s.userId)
                        : [...prev, s.userId]
                    );
                  }}
                  style={{
                    width: "17px",
                    height: "17px",
                    borderRadius: "4px",
                    border: `2px solid ${selectedIds.includes(s.userId) ? "#2d5be3" : "#d1d5db"}`,
                    backgroundColor: selectedIds.includes(s.userId) ? "#2d5be3" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  {selectedIds.includes(s.userId) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => {
                    setSelectedIds((prev) =>
                      prev.includes(s.userId)
                        ? prev.filter((id) => id !== s.userId)
                        : [...prev, s.userId]
                    );
                  }}
                >
                  {s.userName}
                </span>
              </label>
            ))}

            {students.length === 0 && (
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>No students found</p>
            )}
          </div>
        </div>
      )}

      {/* Message textarea */}
      <div style={{ marginBottom: "16px" }}>
        {!isReply && (
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
            Message
          </label>
        )}
        <textarea
          rows={isReply ? 3 : 4}
          placeholder={isReply ? "Write your reply..." : "Write a new message..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "13.5px",
            color: "#1a1d23",
            backgroundColor: "#fafbfc",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "inherit",
            transition: "border-color 0.15s ease",
          }}
          onFocus={e => e.target.style.borderColor = "#2d5be3"}
          onBlur={e => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 18px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "1px solid #e2e6ea",
              borderRadius: "7px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          style={{
            padding: "9px 22px",
            backgroundColor: "#2d5be3",
            color: "#ffffff",
            border: "none",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageForm;