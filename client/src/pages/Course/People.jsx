import { useParams } from "react-router-dom";

function People() {
  const { courseId } = useParams();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">People</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Instructors</h2>
          <p className="text-gray-500">Teachers of course #{courseId}</p>
        </div>

        <div>
          <h2 className="font-semibold">Students</h2>
          <p className="text-gray-500">Students enrolled in this course</p>
        </div>
      </div>
    </div>
  );
}

export default People;
