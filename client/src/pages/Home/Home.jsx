import { useEffect, useState } from "react";
import CourseCard from "../../components/course/CourseCard";
import CreateCourseModal from "../../components/course/CreateCourseModal";
import JoinCourseModal from "../../components/course/JoinCourseModal";
import { useAuth } from "../../context/AuthContext";
import {
  getAllCourses,
  getTeacherCourses,
  getStudentCourses,
} from "../../services/courseService";

const FILTERS = {
  ALL: "ALL",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
};

function Home() {
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const { user, logout, courses, setCourses } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadCourses();
    }
  }, [filter, user]);

  async function loadCourses() {
    setLoading(true);
    try {
      if (!user?.id) return;
      let data;
      if (filter === FILTERS.TEACHER) {
        data = await getTeacherCourses(user.id);
      } else if (filter === FILTERS.STUDENT) {
        data = await getStudentCourses(user.id);
      } else {
        data = await getAllCourses(user.id);
      }
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  }

  const filterOptions = [
    { key: FILTERS.ALL, label: "All Courses" },
    { key: FILTERS.TEACHER, label: "Teaching" },
    { key: FILTERS.STUDENT, label: "Studying" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e6ea",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "68px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "34px",
            height: "34px",
            backgroundColor: "#2d5be3",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-1H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-1h7z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>Classroom</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "8px 18px",
              backgroundColor: "#2d5be3",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              letterSpacing: "0.1px",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Course
          </button>

          <button
            onClick={() => setShowJoin(true)}
            style={{
              padding: "8px 18px",
              backgroundColor: "#ffffff",
              color: "#2d5be3",
              border: "1.5px solid #2d5be3",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              letterSpacing: "0.1px",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#eef2fc"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
          >
            Join Course
          </button>

          <div style={{ width: "1px", height: "28px", backgroundColor: "#e2e6ea", margin: "0 6px" }} />

          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "1px solid #e2e6ea",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e6ea"; e.currentTarget.style.color = "#6b7280"; }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "32px 40px", maxWidth: "1140px", margin: "0 auto" }}>
        {/* Page title + filters row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>My Courses</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0 0" }}>
              {courses.length} {courses.length === 1 ? "course" : "courses"} found
            </p>
          </div>

          {/* Filter pills */}
          <div style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "#eef0f3",
            borderRadius: "8px",
            padding: "3px",
          }}>
            {filterOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                style={{
                  padding: "6px 16px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: filter === opt.key ? "600" : "500",
                  color: filter === opt.key ? "#2d5be3" : "#6b7280",
                  backgroundColor: filter === opt.key ? "#ffffff" : "transparent",
                  cursor: "pointer",
                  boxShadow: filter === opt.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{
                width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
                borderTopColor: "#2d5be3", borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }} />
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading courses...</span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : courses.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e2e6ea",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              backgroundColor: "#eef2fc", display: "flex",
              alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-1H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-1h7z"/>
              </svg>
            </div>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: "0 0 6px" }}>No courses found</p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Create a new course or join an existing one to get started.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && <CreateCourseModal onClose={() => setShowCreate(false)} />}
      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} />}
    </div>
  );
}

export default Home;