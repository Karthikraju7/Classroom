import { useParams, NavLink, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { CourseProvider, useCourse } from "../../context/CourseContext";
import { getCourseById } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

import CourseSwitcher from "../../components/course/CourseSwitcher";

import Announcements from "./Announcements";
import Attachments from "./Attachments";
import Assignments from "./Assignments";
import People from "./People";
import Messages from "./Messages";
import AssignmentDetail from "./AssignmentDetail";
import AnnouncementDetail from "./AnnouncementDetail";

const NAV_ITEMS = [
  {
    key: "announcements",
    label: "Announcements",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d5be3" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    key: "attachments",
    label: "Attachments",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d5be3" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    key: "assignments",
    label: "Assignments",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d5be3" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    key: "people",
    label: "People",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d5be3" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key: "messages",
    label: "Messages",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d5be3" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

function CourseLayoutInner() {
  const { courseId } = useParams();
  const { setActiveCourse, setRole, activeCourse } = useCourse();
  const { user, courses } = useAuth();
  const [showSwitcher, setShowSwitcher] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await getCourseById(courseId, user.id);
        setActiveCourse(data);
        setRole(data.role);
      } catch (err) {
        console.error("Failed to load course", err);
      }
    }

    if (user && courseId) {
      loadCourse();
    }
  }, [courseId, user]);

  if (!activeCourse) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
            borderTopColor: "#2d5be3", borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Loading course...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top header */}
      <header style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e6ea",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Left: hamburger + course name */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => setShowSwitcher(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f3f4f6"; e.currentTarget.style.color = "#1a1d23"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

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
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#1a1d23", letterSpacing: "-0.2px" }}>
              {activeCourse.name}
            </span>
          </div>
        </div>
      </header>

      {/* CourseSwitcher drawer */}
      {showSwitcher && (
        <CourseSwitcher
          courses={courses}
          currentCourseId={Number(courseId)}
          onClose={() => setShowSwitcher(false)}
        />
      )}

      {/* Body: sidebar + main */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{
          width: "230px",
          flexShrink: 0,
          backgroundColor: "#f8f9fb",
          borderRight: "1px solid #e2e6ea",
          padding: "12px 10px",
          overflowY: "auto",
        }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={`/courses/${courseId}/${item.key}`}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  fontSize: "13.5px",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#2d5be3" : "#4b5563",
                  backgroundColor: isActive ? "#eef2fc" : "transparent",
                  transition: "all 0.15s ease",
                })}
                onMouseEnter={e => { if (!e.currentTarget.style.backgroundColor.includes("eef2fc")) e.currentTarget.style.backgroundColor = "#eef0f3"; }}
                onMouseLeave={e => { if (!window.location.pathname.includes(item.key)) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {item.icon(window.location.pathname.includes(item.key))}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 32px",
          backgroundColor: "#f4f6f8",
        }}>
          <Routes>
            <Route index element={<Announcements />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="announcements/:announcementId" element={<AnnouncementDetail />} />
            <Route path="attachments" element={<Attachments />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="assignments/:announcementId" element={<AssignmentDetail />} />
            <Route path="people" element={<People />} />
            <Route path="messages" element={<Messages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function CourseLayout() {
  return (
    <CourseProvider>
      <CourseLayoutInner />
    </CourseProvider>
  );
}

export default CourseLayout;