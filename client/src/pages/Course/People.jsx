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


  const instructors = members.filter(
    (m) => m.role === "TEACHER"
  );

  const students = members.filter(
    (m) => m.role === "STUDENT"
  );

  if (loading) {
    return <p className="text-gray-500">Loading people...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">People</h1>

      {/* Instructors */}
      <div className="mb-8">
        <h2 className="font-semibold mb-2">
          Instructors ({instructors.length})
        </h2>

        <div className="space-y-2">
          {instructors.map((i) => (
            <div
              key={i.userId}
              className="border rounded px-4 py-2 bg-white"
            >
              <p className="font-medium">{i.userName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Students */}
      <div>
        <h2 className="font-semibold mb-2">
          Students ({students.length})
        </h2>

        <div className="space-y-2">
          {students.map((s) => (
            <div
              key={s.userId}
              className="border rounded px-4 py-2 bg-white"
            >
              <p className="font-medium">{s.userName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default People;
