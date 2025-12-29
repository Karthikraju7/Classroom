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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Assignments</h1>

        {role === "TEACHER" && (
          <span className="text-sm text-gray-500">
            Assignments are created from Announcements
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500">No assignments yet</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              onClick={() => openAssignment(a.id)}
              className="border rounded p-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{a.title}</h2>
                <span className="text-xs text-red-600">
                  Due: {new Date(a.dueDate).toLocaleString()}
                </span>
              </div>

              {a.content && (
                <p className="text-sm text-gray-600 mt-1">
                  {a.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Assignments;
