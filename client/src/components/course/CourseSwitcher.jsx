import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

const CourseSwitcher = ({ onClose, currentCourseId }) => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadCourses();
    }
  }, [user]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getAllCourses(user.id);
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  const roleColors = {
    TEACHER: { bg: "#eef2fc", color: "#2d5be3" },
    STUDENT: { bg: "#ecfdf5", color: "#059669" },
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 40,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        width: "280px",
        backgroundColor: "#ffffff",
        zIndex: 50,
        boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        {/* Drawer header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px 14px",
          borderBottom: "1px solid #e2e6ea",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px", height: "30px",
              backgroundColor: "#2d5be3",
              borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-1H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-1h7z"/>
              </svg>
            </div>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23" }}>My Courses</span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px", borderRadius: "6px",
              display: "flex", alignItems: "center", justifyContent: "center",
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

        {/* Drawer body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {/* Home button */}
          <div
            onClick={() => { navigate("/"); onClose(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "7px",
              cursor: "pointer",
              marginBottom: "6px",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={{
              width: "30px", height: "30px",
              borderRadius: "7px",
              backgroundColor: "#eef2fc",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1a1d23" }}>Home</span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#e2e6ea", margin: "8px 12px" }} />

          {/* Section label */}
          <p style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px", margin: "10px 0 6px 14px" }}>
            Courses
          </p>

          {/* Course list */}
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px" }}>
              <div style={{
                width: "14px", height: "14px", border: "2px solid #e2e6ea",
                borderTopColor: "#2d5be3", borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }} />
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Loading...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : courses.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#9ca3af", padding: "12px 14px", margin: 0 }}>No courses</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {courses.map((course) => {
                const isCurrent = Number(course.id) === Number(currentCourseId);
                const role = roleColors[course.role] || { bg: "#f3f4f6", color: "#6b7280" };

                return (
                  <div
                    key={course.id}
                    onClick={() => { navigate(`/courses/${course.id}/announcements`); onClose(); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: "7px",
                      cursor: "pointer",
                      backgroundColor: isCurrent ? "#eef2fc" : "transparent",
                      border: isCurrent ? "1px solid #d6e4fc" : "1px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                    onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: "13.5px",
                        fontWeight: isCurrent ? "600" : "500",
                        color: isCurrent ? "#2d5be3" : "#1a1d23",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "160px",
                      }}>
                        {course.name}
                      </p>
                    </div>

                    <span style={{
                      fontSize: "10.5px",
                      fontWeight: "600",
                      color: role.color,
                      backgroundColor: role.bg,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      marginLeft: "8px",
                    }}>
                      {course.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseSwitcher;