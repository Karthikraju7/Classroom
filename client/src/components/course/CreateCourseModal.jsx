import { useState } from "react";
import { createCourse } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

function CreateCourseModal({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleCreate() {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createCourse({
        name,
        description,
        userId: user.id,
      });
      onClose();
    } catch (err) {
      console.error("Failed to create course", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(2px)",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        width: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}>
        {/* Modal header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 24px 0",
        }}>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>
              Create Course
            </h2>
            <p style={{ fontSize: "12.5px", color: "#6b7280", margin: "4px 0 0" }}>
              Fill in the details below to create a new course.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
              Course Name <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              required
              placeholder="e.g. Introduction to Physics"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `1.5px solid ${name ? "#2d5be3" : "#d1d5db"}`,
                borderRadius: "8px",
                fontSize: "13.5px",
                color: "#1a1d23",
                backgroundColor: "#fafbfc",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease",
              }}
              onFocus={e => e.target.style.borderColor = "#2d5be3"}
              onBlur={e => e.target.style.borderColor = name ? "#2d5be3" : "#d1d5db"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
              Description <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
            </label>
            <textarea
              placeholder="Briefly describe the course..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
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
                transition: "border-color 0.15s ease",
                fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "#2d5be3"}
              onBlur={e => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
        </div>

        {/* Modal footer */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          padding: "0 24px 22px",
        }}>
          <button
            onClick={onClose}
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
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            style={{
              padding: "9px 22px",
              backgroundColor: loading || !name.trim() ? "#93aef5" : "#2d5be3",
              color: "#ffffff",
              border: "none",
              borderRadius: "7px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: loading || !name.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={e => { if (!loading && name.trim()) e.currentTarget.style.backgroundColor = "#2349c4"; }}
            onMouseLeave={e => { if (!loading && name.trim()) e.currentTarget.style.backgroundColor = "#2d5be3"; }}
          >
            {loading && (
              <div style={{
                width: "13px", height: "13px",
                border: "2px solid rgba(255,255,255,0.35)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }} />
            )}
            {loading ? "Creating..." : "Create Course"}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;