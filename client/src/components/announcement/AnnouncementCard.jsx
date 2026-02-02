import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AnnouncementCard({ announcement }) {
  function getPreview(text, limit = 150) {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  }

  const navigate = useNavigate();
  const { courseId } = useParams();
  const [hovered, setHovered] = useState(false);

  function openDetail() {
    if (announcement.type === "ASSIGNMENT") {
      navigate(`/courses/${courseId}/assignments/${announcement.id}`);
    } else {
      navigate(`/courses/${courseId}/announcements/${announcement.id}`);
    }
  }

  const isAssignment = announcement.type === "ASSIGNMENT";

  return (
    <div
      onClick={openDetail}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${hovered ? "#2d5be3" : "#e2e6ea"}`,
        borderRadius: "10px",
        padding: "20px 22px",
        cursor: "pointer",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        boxShadow: hovered ? "0 4px 12px rgba(45, 91, 227, 0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: announcement.content ? "10px" : "0" }}>
        <h2 style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#1a1d23",
          margin: 0,
          letterSpacing: "-0.2px",
        }}>
          {announcement.title}
        </h2>

        {isAssignment && (
          <span style={{
            fontSize: "11.5px",
            fontWeight: "600",
            color: "#d97706",
            backgroundColor: "#fef3c7",
            padding: "3px 10px",
            borderRadius: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            whiteSpace: "nowrap",
          }}>
            Assignment
          </span>
        )}
      </div>

      {/* Content preview */}
      {announcement.content && (
        <p style={{ fontSize: "13.5px", color: "#4b5563", margin: "0 0 12px", lineHeight: "1.55" }}>
          {getPreview(announcement.content)}
        </p>
      )}

      {/* Due date */}
      {announcement.dueDate && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <p style={{ fontSize: "12.5px", color: "#dc2626", fontWeight: "500", margin: 0 }}>
            Due: {new Date(announcement.dueDate).toLocaleString()}
          </p>
        </div>
      )}

      {/* Footer row: posted date */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
        <p style={{ fontSize: "11.5px", color: "#9ca3af", margin: 0 }}>
          Posted on {new Date(announcement.createdAt).toLocaleString()}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          opacity: hovered ? 1 : 0.3,
          transition: "opacity 0.2s ease",
        }}>
          <span style={{ fontSize: "12px", color: "#2d5be3", fontWeight: "500", marginRight: "4px" }}>
            {isAssignment ? "Open assignment" : "Open announcement"}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementCard;