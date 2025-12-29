import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { getAnnouncementsByCourse } from "../../services/announcementService";
import {
  submitAssignment,
  getSubmissionsByAssignment,
} from "../../services/assignmentSubmissionService";

function AssignmentDetail() {
  const { courseId, announcementId } = useParams();
  const { role } = useCourse();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadAssignment();
  }, [announcementId]);

  useEffect(() => {
    if (role === "TEACHER") {
      loadSubmissions();
    }
  }, [role]);

  async function loadAssignment() {
    setLoading(true);
    try {
      const announcements = await getAnnouncementsByCourse(courseId);
      const found = announcements.find(
        (a) => a.id === Number(announcementId)
      );
      setAssignment(found);
    } catch (err) {
      console.error("Failed to load assignment", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubmissions() {
    try {
      const data = await getSubmissionsByAssignment(announcementId);
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions", err);
    }
  }

  async function handleSubmit() {
    if (!submissionText.trim()) return;

    setSubmitting(true);
    try {
      await submitAssignment({
        announcementId,
        content: submissionText,
      });
      setSubmissionText("");
      alert("Submission successful");
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !assignment) {
    return <p className="text-gray-500">Loading assignment...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Assignment info */}
      <div>
        <h1 className="text-2xl font-semibold">{assignment.title}</h1>

        {assignment.dueDate && (
          <p className="text-red-600 mt-1">
            Due: {new Date(assignment.dueDate).toLocaleString()}
          </p>
        )}

        {assignment.content && (
          <p className="mt-4 text-gray-700">{assignment.content}</p>
        )}
      </div>

      {/* Student submission */}
      {role === "STUDENT" && (
        <div className="border rounded p-4 space-y-3">
          <h2 className="font-semibold">Your Submission</h2>

          <textarea
            rows={5}
            className="w-full border rounded px-3 py-2"
            placeholder="Write your answer here..."
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {/* Teacher submissions view */}
      {role === "TEACHER" && (
        <div className="space-y-3">
          <h2 className="font-semibold">Student Submissions</h2>

          {submissions.length === 0 ? (
            <p className="text-gray-500">No submissions yet</p>
          ) : (
            submissions.map((s) => (
              <div
                key={s.id}
                className="border rounded p-3 bg-gray-50"
              >
                <p className="text-sm text-gray-700">{s.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted at{" "}
                  {new Date(s.submittedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AssignmentDetail;
