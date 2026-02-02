import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { getAssignmentsByCourse } from "../../services/announcementService";

function Assignments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { role } = useCourse();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, [courseId]);

  async function loadAssignments() {
    setLoading(true);
    try {
      const data = await getAssignmentsByCourse(courseId);
      setAssignments(data);
    } catch (err) {
      console.error("Failed to load assignments", err);
    } finally {
      setLoading(false);
    }
  }

  function openAssignment(id) {
    navigate(`/courses/${courseId}/assignments/${id}`);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>
            Assignments
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
            {assignments.length} {assignments.length === 1 ? "assignment" : "assignments"}
          </p>
        </div>

        {role === "TEACHER" && (
          <span style={{
            fontSize: "12px",
            color: "#6b7280",
            backgroundColor: "#f3f4f6",
            border: "1px solid #e2e6ea",
            borderRadius: "6px",
            padding: "5px 10px",
          }}>
            Created from Announcements
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{
              width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
              borderTopColor: "#2d5be3", borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }} />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading assignments...</span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : assignments.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "72px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e2e6ea",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            backgroundColor: "#fef3c7", display: "flex",
            alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: "0 0 6px" }}>No assignments yet</p>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            {role === "TEACHER" ? "Create assignments by posting an announcement with the Assignment type." : "Your teacher hasn't assigned anything yet."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {assignments.map((a) => (
            <AssignmentRow key={a.id} assignment={a} onOpen={() => openAssignment(a.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentRow({ assignment, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const isDeadlinePassed = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  function getPreview(text, limit = 120) {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  }

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${hovered ? "#2d5be3" : "#e2e6ea"}`,
        borderRadius: "10px",
        padding: "18px 20px",
        cursor: "pointer",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        boxShadow: hovered ? "0 4px 12px rgba(45, 91, 227, 0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
        borderLeft: "3px solid #d97706",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: assignment.content ? "8px" : "6px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.2px" }}>
          {assignment.title}
        </h2>

        {assignment.dueDate && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isDeadlinePassed ? "#9ca3af" : "#dc2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{
              fontSize: "12px",
              fontWeight: "500",
              color: isDeadlinePassed ? "#9ca3af" : "#dc2626",
              whiteSpace: "nowrap",
            }}>
              {isDeadlinePassed ? "Deadline passed" : `Due: ${new Date(assignment.dueDate).toLocaleString()}`}
            </span>
          </div>
        )}
      </div>

      {/* Description preview */}
      {assignment.content && (
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 10px", lineHeight: "1.5" }}>
          {getPreview(assignment.content)}
        </p>
      )}

      {/* Open hint */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        opacity: hovered ? 1 : 0.3,
        transition: "opacity 0.2s ease",
      }}>
        <span style={{ fontSize: "12px", color: "#2d5be3", fontWeight: "500", marginRight: "4px" }}>Open assignment</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
}

export default Assignments;