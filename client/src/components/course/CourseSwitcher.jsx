import React from "react";
import { useNavigate } from "react-router-dom";

const CourseSwitcher = ({ courses, onClose, currentCourseId }) => {
  const navigate = useNavigate();

  if (!Array.isArray(courses)) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">My Courses</h2>

        {/* HOME LINK */}
        <div
          onClick={() => {
            navigate("/");
            onClose();
          }}
          className="flex items-center gap-2 p-3 mb-3 rounded cursor-pointer border hover:bg-gray-50"
        >
          <span>🏠</span>
          <span className="font-medium">Home</span>
        </div>

        <hr className="mb-3" />

        {/* COURSES */}
        {courses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses</p>
        ) : (
          <ul className="space-y-2">
            {courses.map(course => (
              <li
                key={course.id}
                onClick={() => {
                  navigate(`/courses/${course.id}/announcements`);
                  onClose();
                }}
                className={`p-3 rounded cursor-pointer border
                  ${
                    Number(course.id) === Number(currentCourseId)
                      ? "bg-gray-100 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
              >
                <div>{course.name}</div>
                <div className="text-xs text-gray-500">
                  {course.role}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default CourseSwitcher;
