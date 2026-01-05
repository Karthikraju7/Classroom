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

  // student
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // teacher
  const [activeTab, setActiveTab] = useState("INSTRUCTIONS"); // INSTRUCTIONS | STUDENT_WORK
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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

      {/* ================= STUDENT VIEW ================= */}
      {role === "STUDENT" && (
        <div className="flex gap-6">
          {/* LEFT — Instructions */}
          <div className="w-3/4 space-y-4">
            <h1 className="text-2xl font-semibold">{assignment.title}</h1>

            {assignment.dueDate && (
              <p className="text-red-600">
                Due: {new Date(assignment.dueDate).toLocaleString()}
              </p>
            )}

            {assignment.content && (
              <p className="text-gray-700 whitespace-pre-line">
                {assignment.content}
              </p>
            )}
          </div>

          {/* RIGHT — Your Work */}
          <div className="w-1/4 border rounded p-4 space-y-3">
            <h2 className="font-semibold">Your work</h2>

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
              className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Turn in"}
            </button>
          </div>
        </div>
      )}

      {/* ================= TEACHER VIEW ================= */}
      {role === "TEACHER" && (
        <>
          {/* Tabs */}
          <div className="flex gap-6 border-b">
            <button
              onClick={() => setActiveTab("INSTRUCTIONS")}
              className={`pb-2 ${
                activeTab === "INSTRUCTIONS"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Instructions
            </button>

            <button
              onClick={() => setActiveTab("STUDENT_WORK")}
              className={`pb-2 ${
                activeTab === "STUDENT_WORK"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Student work
            </button>
          </div>

          {/* ---------- Instructions TAB ---------- */}
          {activeTab === "INSTRUCTIONS" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">{assignment.title}</h1>

              {assignment.dueDate && (
                <p className="text-red-600">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
              )}

              {assignment.content && (
                <p className="text-gray-700 whitespace-pre-line">
                  {assignment.content}
                </p>
              )}
            </div>
          )}

          {/* ---------- Student Work TAB ---------- */}
          {activeTab === "STUDENT_WORK" && (
            <div className="flex gap-6">
              {/* LEFT — Selected Student Submission */}
              <div className="w-3/4 border rounded p-6">
                {selectedSubmission ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      Student submission
                    </h2>

                    <p className="text-sm text-gray-500">
                      Submitted at{" "}
                      {new Date(
                        selectedSubmission.submittedAt
                      ).toLocaleString()}
                    </p>

                    <p className="text-gray-800 whitespace-pre-line">
                      {selectedSubmission.content}
                    </p>

                    <div className="pt-4 border-t space-y-2">
                      <input
                        type="text"
                        placeholder="Grade"
                        className="border rounded px-3 py-2 w-32"
                      />

                      <textarea
                        rows={3}
                        placeholder="Feedback"
                        className="w-full border rounded px-3 py-2"
                      />

                      <button className="px-4 py-2 bg-green-600 text-white rounded">
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Select a student to view submission
                  </p>
                )}
              </div>

              {/* RIGHT — Student List */}
              <div className="w-1/4 border rounded p-4 space-y-3">
                <h2 className="font-semibold">Students</h2>

                {submissions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No submissions yet
                  </p>
                ) : (
                  submissions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSubmission(s)}
                      className={`cursor-pointer rounded px-3 py-2 text-sm ${
                        selectedSubmission?.id === s.id
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Student
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AssignmentDetail;
