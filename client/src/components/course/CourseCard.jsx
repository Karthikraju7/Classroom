import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CourseCard({ course }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const roleColors = {
    TEACHER: { bg: "#eef2fc", color: "#2d5be3" },
    STUDENT: { bg: "#ecfdf5", color: "#059669" },
  };

  const role = roleColors[course.role] || { bg: "#f3f4f6", color: "#6b7280" };

  return (
    <div
      onClick={handleClick}
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
      {/* Top row: name + role badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: course.description ? "12px" : "0" }}>
        <h3 style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#1a1d23",
          margin: 0,
          letterSpacing: "-0.2px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px",
        }}>
          {course.name}
        </h3>

        <span style={{
          fontSize: "11.5px",
          fontWeight: "600",
          color: role.color,
          backgroundColor: role.bg,
          padding: "4px 10px",
          borderRadius: "20px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          whiteSpace: "nowrap",
        }}>
          {course.role}
        </span>
      </div>

      {/* Description */}
      {course.description && (
        <p style={{
          fontSize: "13px",
          color: "#6b7280",
          margin: 0,
          lineHeight: "1.5",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {course.description}
        </p>
      )}

      {/* Bottom: open indicator */}
      <div style={{
        marginTop: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        opacity: hovered ? 1 : 0.35,
        transition: "opacity 0.2s ease",
      }}>
        <span style={{ fontSize: "12px", color: "#2d5be3", fontWeight: "500", marginRight: "4px" }}>Open course</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
}

export default CourseCard;