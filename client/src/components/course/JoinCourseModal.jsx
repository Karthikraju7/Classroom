import { useState } from "react";

function JoinCourseModal({ onClose }) {
  const [courseId, setCourseId] = useState("");

  async function handleJoin() {
    await joinCourse(courseId);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-80 space-y-4">
        <h2 className="text-lg font-semibold">Join Course</h2>

        <input
          className="w-full border p-2"
          placeholder="Course ID"
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleJoin} className="bg-blue-600 text-white px-4 py-2 rounded">
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
export default JoinCourseModal;