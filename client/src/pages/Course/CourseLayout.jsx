import { useParams, NavLink, Routes, Route, Navigate } from "react-router-dom";
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
    return <div className="p-6">Loading course...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* TOP NAVBAR */}
      <header className="h-14 flex items-center justify-between px-4 border-b bg-white">
        <div className="flex items-center gap-3">
          {/* HAMBURGER */}
          <button
            onClick={() => setShowSwitcher(true)}
            className="text-xl cursor-pointer"
          >
            ☰
          </button>

          <div className="font-semibold text-lg">
            {activeCourse.name}
          </div>
        </div>

        <div className="cursor-pointer">👤</div>
      </header>

      {/* COURSE SWITCHER DRAWER */}
      {showSwitcher && (
        <CourseSwitcher
          courses={courses}
          currentCourseId={Number(courseId)}
          onClose={() => setShowSwitcher(false)}
        />
      )}

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 border-r p-4 bg-gray-50">
          <nav className="flex flex-col gap-3">
            <NavLink to={`/courses/${courseId}/announcements`}>Announcements</NavLink>
            <NavLink to={`/courses/${courseId}/attachments`}>Attachments</NavLink>
            <NavLink to={`/courses/${courseId}/assignments`}>Assignments</NavLink>
            <NavLink to={`/courses/${courseId}/people`}>People</NavLink>
            <NavLink to={`/courses/${courseId}/messages`}>Messages</NavLink>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
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
