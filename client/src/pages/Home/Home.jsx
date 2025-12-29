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
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const { user, logout } = useAuth();

  console.log("user:", user);
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

  return (
    <div className="p-6 space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Courses</h1>

        <div className="flex gap-3">
          <button onClick={() => setShowCreate(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
            Create Course
          </button>
          <button onClick={() => setShowJoin(true)}
                  className="px-4 py-2 border rounded cursor-pointer">
            Join Course
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setFilter(FILTERS.ALL)}
          className={filter === FILTERS.ALL ? "font-medium border-b-2 border-blue-600" : "text-gray-600 cursor-pointer"}
        >
          All
        </button>
        <button
          onClick={() => setFilter(FILTERS.TEACHER)}
          className={filter === FILTERS.TEACHER ? "font-medium border-b-2 border-blue-600" : "text-gray-600 cursor-pointer"}
        >
          Teaching
        </button>
        <button
          onClick={() => setFilter(FILTERS.STUDENT)}
          className={filter === FILTERS.STUDENT ? "font-medium border-b-2 border-blue-600" : "text-gray-600 cursor-pointer"}
        >
          Studying
        </button>
      </div>

      {/* Course list */}
      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses found</p>
          ) : (
            courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      )}
      {showCreate && (
      <CreateCourseModal onClose={() => setShowCreate(false)} />
      )}

      {showJoin && (
      <JoinCourseModal onClose={() => setShowJoin(false)} />
      )}
    </div>
  );
}

export default Home;
