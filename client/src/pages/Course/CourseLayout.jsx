import { useParams, NavLink, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { CourseProvider, useCourse } from "../../context/CourseContext";
import { getCourseById } from "../../services/courseService";

import Announcements from "./Announcements";
import Attachments from "./Attachments";
import Assignments from "./Assignments";
import People from "./People";
import Messages from "./Messages";
import AssignmentDetail from "./AssignmentDetail";

function CourseLayoutInner() {
  const { courseId } = useParams();
  const { setActiveCourse, setRole, activeCourse } = useCourse();

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await getCourseById(courseId);
        setActiveCourse(data);
        setRole(data.role);
      } catch (err) {
        console.error("Failed to load course", err);
      }
    }

    loadCourse();
  }, [courseId]);

  if (!activeCourse) {
    return <div className="p-6">Loading course...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* TOP NAVBAR */}
      <header className="h-14 flex items-center justify-between px-4 border-b bg-white">
        <div className="font-semibold text-lg">
          {activeCourse.name}
        </div>
        <div className="cursor-pointer">👤</div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 border-r p-4 bg-gray-50">
          <nav className="flex flex-col gap-3">
            <NavLink to="announcements">Announcements</NavLink>
            <NavLink to="attachments">Attachments</NavLink>
            <NavLink to="assignments">Assignments</NavLink>
            <NavLink to="people">People</NavLink>
            <NavLink to="messages">Messages</NavLink>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="announcements" />} />
            <Route path="announcements" element={<Announcements />} />
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
