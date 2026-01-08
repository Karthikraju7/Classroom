import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission,
  getMySubmission, // ✅ MISSING IMPORT (CRITICAL)
} from "../../services/assignmentSubmissionService";
import { getAnnouncementsByCourse } from "../../services/announcementService";
import { useAuth } from "../../context/AuthContext";
import config from "../../config";


function AssignmentDetail() {
  const { courseId, announcementId } = useParams();
  const { role } = useCourse();
  const { user } = useAuth();
  const userId = user?.id;

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);


  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState(null);

  const [activeTab, setActiveTab] = useState("INSTRUCTIONS");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");


  useEffect(() => {
    loadAssignment();
  }, [announcementId]);

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
  useEffect(() => {
    if (role === "STUDENT" && userId && announcementId) {
      loadMySubmission();
    }
  }, [role, userId, announcementId]);

  async function loadMySubmission() {
    try {
      const data = await getMySubmission(announcementId, userId);
      setMySubmission(data);
    } catch (err) {
      console.error("Failed to load my submission", err);
      setMySubmission(null);
    }
  }

  async function handleSubmit() {
    if (files.length === 0) {
      alert("Select at least one file");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("announcementId", announcementId);
      formData.append("userId", userId);
      files.forEach((f) => formData.append("files", f));

      await submitAssignment(formData);

      await loadMySubmission();

      setFiles([]);
      alert("Submission successful");
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }


  useEffect(() => {
    if (role === "TEACHER" && userId) {
      loadSubmissions();
    }
  }, [role, userId]);

  async function loadSubmissions() {
    try {
      const data = await getSubmissionsByAssignment(announcementId, userId);
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions", err);
    }
  }

  if (loading || !assignment) {
    return <p className="text-gray-500">Loading assignment...</p>;
  }

  return (
    <div className="space-y-6">

      {/* STUDENT VIEW */}
      {role === "STUDENT" && (
        <div className="flex gap-6">
          {/* LEFT */}
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

          {/* RIGHT */}
          <div className="w-1/4 border rounded p-4 space-y-3">
            <h2 className="font-semibold">Your work</h2>

            {/* Status */}
            {mySubmission && mySubmission.files?.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-green-600">Submitted</p>

                <ul className="list-disc pl-5 text-sm">
                  {mySubmission.files.map((f) => (
                    <li key={f.id}>
                      <a
                        href={`${config.API_BASE_URL}/assignment-submissions/files/${f.id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {f.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Not submitted yet</p>
            )}

            {/* FILE */}
            <input
              type="file"
              multiple
              id="assignment-files"
              className="hidden"
              onChange={(e) => {
                setFiles(Array.from(e.target.files));
                e.target.value = null;
              }}
            />

            <label
              htmlFor="assignment-files"
              className="block w-full cursor-pointer text-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              Choose files
            </label>

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

      {/* TEACHER VIEW */}
      {role === "TEACHER" && (
        <>
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
          {activeTab === "STUDENT_WORK" && (
            <div className="flex gap-6">
              <div className="w-3/4 border rounded p-6">
                {selectedSubmission ? (
                  <>
                    <p className="text-sm text-gray-500">
                      Submitted at{" "}
                      {new Date(
                        selectedSubmission.submittedAt
                      ).toLocaleString()}
                    </p>

                    <ul className="list-disc pl-5 text-sm">
                      {selectedSubmission.files?.map((f) => (
                        <li key={f.id}>
                          <a
                            href={`${config.API_BASE_URL}/assignment-submissions/files/${f.id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {f.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t space-y-2">
                      <input
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Grade"
                        className="border px-3 py-2 w-32"
                      />
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Feedback"
                        className="w-full border px-3 py-2"
                      />
                      <button
                        onClick={async () => {
                          await gradeSubmission(
                            selectedSubmission.id,
                            userId,
                            grade,
                            feedback
                          );
                          await loadSubmissions();
                          alert("Grade saved");
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">
                    Select a student to view submission
                  </p>
                )}
              </div>

              <div className="w-1/4 border rounded p-4">
                {submissions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSubmission(s)}
                    className={`cursor-pointer rounded px-3 py-2 text-sm ${
                      selectedSubmission?.id === s.id
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {s.studentName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AssignmentDetail;
