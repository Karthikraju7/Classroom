import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseMembers } from "../../services/courseService";

function People() {
  const { courseId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [courseId]);

  async function loadMembers() {
    try {
      const data = await getCourseMembers(courseId);
      console.log("Members from API:", data);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load course members", err);
    } finally {
      setLoading(false);
    }
  }

  const instructors = members.filter((m) => m.role === "TEACHER");
  const students = members.filter((m) => m.role === "STUDENT");

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
            borderTopColor: "#2d5be3", borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading people...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  function getInitial(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  }

  function AvatarCircle({ name, colorIndex }) {
    // Deterministic color palette based on name
    const colors = [
      { bg: "#eef2fc", text: "#2d5be3" },
      { bg: "#ecfdf5", text: "#059669" },
      { bg: "#fef3c7", text: "#d97706" },
      { bg: "#fce7f3", text: "#db2777" },
      { bg: "#ede9fe", text: "#7c3aed" },
      { bg: "#ffedd5", text: "#ea580c" },
    ];
    const c = colors[colorIndex % colors.length];

    return (
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: c.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: "14px",
        fontWeight: "700",
        color: c.text,
      }}>
        {getInitial(name)}
      </div>
    );
  }

  function MemberRow({ member, index }) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e6ea",
        borderRadius: "8px",
      }}>
        <AvatarCircle name={member.userName} colorIndex={index} />
        <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1d23" }}>
          {member.userName}
        </span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>
          People
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
          {members.length} {members.length === 1 ? "member" : "members"} in this course
        </p>
      </div>

      {/* Instructors */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: 0, letterSpacing: "0.1px" }}>
            Instructors
          </h2>
          <span style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#2d5be3",
            backgroundColor: "#eef2fc",
            padding: "2px 8px",
            borderRadius: "10px",
          }}>
            {instructors.length}
          </span>
        </div>

        {instructors.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, paddingLeft: "2px" }}>No instructors</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {instructors.map((m, idx) => (
              <MemberRow key={m.userId} member={m} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Students */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: 0, letterSpacing: "0.1px" }}>
            Students
          </h2>
          <span style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#059669",
            backgroundColor: "#ecfdf5",
            padding: "2px 8px",
            borderRadius: "10px",
          }}>
            {students.length}
          </span>
        </div>

        {students.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, paddingLeft: "2px" }}>No students</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {students.map((s, idx) => (
              <MemberRow key={s.userId} member={s} index={idx + instructors.length} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default People;