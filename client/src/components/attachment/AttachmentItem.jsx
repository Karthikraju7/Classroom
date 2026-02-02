import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

function AttachmentItem({ attachment }) {
  const { user } = useAuth();
  const [hovered, setHovered] = useState(false);

  function handleOpen() {
    window.open(
      `http://localhost:8080/attachments/${attachment.id}/view?userId=${user.id}`,
      "_blank"
    );
  }

  return (
    <div
      onClick={handleOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid ${hovered ? "#2d5be3" : "#e2e6ea"}`,
        borderRadius: "7px",
        padding: "10px 12px",
        cursor: "pointer",
        backgroundColor: hovered ? "#eef2fc" : "#fafbfc",
        transition: "all 0.15s ease",
      }}
    >
      {/* Left: icon + file info */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          backgroundColor: "#eef2fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#1a1d23",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "260px",
          }}>
            {attachment.fileName}
          </p>
          <p style={{ fontSize: "11.5px", color: "#9ca3af", margin: "2px 0 0" }}>
            {attachment.fileType} · {Math.round(attachment.fileSize / 1024)} KB
          </p>
        </div>
      </div>

      {/* Right: open label + arrow */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
        <span style={{ fontSize: "12.5px", color: "#2d5be3", fontWeight: "500" }}>Open</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
}

export default AttachmentItem;