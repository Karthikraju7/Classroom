import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded p-4 cursor-pointer hover:shadow transition"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{course.name}</h2>

        <span className="text-sm px-2 py-1 rounded bg-gray-200">
          {course.role}
        </span>
      </div>

      {course.description && (
        <p className="text-gray-600 mt-2 text-sm">
          {course.description}
        </p>
      )}
    </div>
  );
}

export default CourseCard;
