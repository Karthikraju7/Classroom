import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission,
  getMySubmission,
} from "../../services/assignmentSubmissionService";
import { getAnnouncementsByCourse } from "../../services/announcementService";
import { useAuth } from "../../context/AuthContext";
import config from "../../config";
import { getAttachmentsByAnnouncement } from "../../services/attachmentService";
import AttachmentItem from "../../components/attachment/AttachmentItem";


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
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const isDeadlinePassed = assignment?.dueDate && new Date(assignment.dueDate) < new Date();

  useEffect(() => {
    if (selectedSubmission) {
      setGrade(selectedSubmission.grade || "");
      setFeedback(selectedSubmission.feedback || "");
    }
  }, [selectedSubmission]);

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
    if (assignment) {
      loadAttachments();
    }
  }, [assignment]);

  async function loadAttachments() {
    setLoadingAttachments(true);
    try {
      const data = await getAttachmentsByAnnouncement(assignment.id);
      setAttachments(data);
    } catch (err) {
      console.error("Failed to load attachments", err);
    } finally {
      setLoadingAttachments(false);
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

  //  LOADING 
  if (loading || !assignment) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
            borderTopColor: "#2d5be3", borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading assignment...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // SHARED STYLES 
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "#1a1d23",
    backgroundColor: "#fafbfc",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s ease",
  };

  function AssignmentInfo() {
    return (
      <div>
        <h1 style={{ fontSize: "21px", fontWeight: "600", color: "#1a1d23", margin: "0 0 10px", letterSpacing: "-0.3px" }}>
          {assignment.title}
        </h1>

        {assignment.dueDate && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: isDeadlinePassed ? "#f3f4f6" : "#fef2f2",
            border: `1px solid ${isDeadlinePassed ? "#e2e6ea" : "#fecaca"}`,
            borderRadius: "7px",
            padding: "7px 12px",
            marginBottom: "18px",
            width: "fit-content",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDeadlinePassed ? "#9ca3af" : "#dc2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p style={{ fontSize: "12.5px", color: isDeadlinePassed ? "#6b7280" : "#dc2626", fontWeight: "600", margin: 0 }}>
              {isDeadlinePassed ? "Deadline passed" : `Due: ${new Date(assignment.dueDate).toLocaleString()}`}
            </p>
          </div>
        )}

        {assignment.content && (
          <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 18px", lineHeight: "1.7", whiteSpace: "pre-line" }}>
            {assignment.content}
          </p>
        )}

        {loadingAttachments ? (
          <p style={{ fontSize: "12.5px", color: "#9ca3af" }}>Loading attachments...</p>
        ) : attachments.length > 0 ? (
          <div>
            <p style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", margin: "0 0 8px", letterSpacing: "0.1px" }}>Attachments</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {attachments.map((att) => (
                <AttachmentItem key={att.id} attachment={att} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // STUDENT VIEW 
  if (role === "STUDENT") {
    const hasSubmitted = mySubmission && mySubmission.files?.length > 0;

    return (
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* LEFT — instructions */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e6ea",
            borderRadius: "10px",
            borderTop: "3px solid #d97706",
            padding: "24px 26px",
          }}>
            <AssignmentInfo />
          </div>
        </div>

        {/* RIGHT — your work sidebar */}
        <div style={{ width: "260px", flexShrink: 0 }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e6ea",
            borderRadius: "10px",
            padding: "20px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1d23", margin: "0 0 14px", letterSpacing: "-0.1px" }}>
              Your Work
            </h2>

            {/* Submission status */}
            {hasSubmitted ? (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#059669" }} />
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#059669" }}>Submitted</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {mySubmission.files.map((f) => (
                    <a
                      key={f.id}
                      href={`${config.API_BASE_URL}/assignment-submissions/files/${f.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "7px 10px",
                        backgroundColor: "#eef2fc",
                        borderRadius: "6px",
                        textDecoration: "none",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span style={{ fontSize: "12.5px", color: "#2d5be3", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {f.fileName}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Grade + feedback */}
                {mySubmission.grade && (
                  <div style={{ borderTop: "1px solid #e2e6ea", marginTop: "14px", paddingTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12.5px", color: "#6b7280", fontWeight: "500" }}>Grade</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#059669" }}>{mySubmission.grade}</span>
                    </div>

                    {mySubmission.feedback && (
                      <div style={{ marginTop: "8px" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Feedback</span>
                        <p style={{ fontSize: "12.5px", color: "#4b5563", margin: "4px 0 0", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                          {mySubmission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 16px" }}>Not submitted yet</p>
            )}

            {/* File picker */}
            <input
              type="file"
              multiple
              id="assignment-files"
              disabled={isDeadlinePassed}
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files);
                setFiles(prev => [...prev, ...selectedFiles]);
              }}
            />

            <label
              htmlFor="assignment-files"
              style={{
                display: "block",
                textAlign: "center",
                padding: "8px 12px",
                border: `1.5px solid ${isDeadlinePassed ? "#d1d5db" : "#2d5be3"}`,
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: "500",
                color: isDeadlinePassed ? "#9ca3af" : "#2d5be3",
                cursor: isDeadlinePassed ? "not-allowed" : "pointer",
                backgroundColor: isDeadlinePassed ? "#f9fafb" : "#eef2fc",
                transition: "all 0.15s ease",
              }}
            >
              Choose Files
            </label>

            {/* Selected file list */}
            {files.length > 0 && (
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                {files.map((file, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    border: "1px solid #e2e6ea",
                    borderRadius: "6px",
                    backgroundColor: "#fafbfc",
                  }}>
                    <span style={{ fontSize: "12px", color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "170px" }}>
                      {file.name}
                    </span>
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "0", fontSize: "12px", fontWeight: "500" }}
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
                      onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitting || isDeadlinePassed}
              style={{
                width: "100%",
                marginTop: "14px",
                padding: "9px 0",
                backgroundColor: (submitting || isDeadlinePassed) ? "#93aef5" : "#2d5be3",
                color: "#ffffff",
                border: "none",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: (submitting || isDeadlinePassed) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={e => { if (!submitting && !isDeadlinePassed) e.currentTarget.style.backgroundColor = "#2349c4"; }}
              onMouseLeave={e => { if (!submitting && !isDeadlinePassed) e.currentTarget.style.backgroundColor = "#2d5be3"; }}
            >
              {submitting && (
                <div style={{
                  width: "13px", height: "13px",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }} />
              )}
              {isDeadlinePassed ? "Deadline Passed" : submitting ? "Submitting..." : "Turn In"}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TEACHER VIEW
  if (role === "TEACHER") {
    const tabs = [
      { key: "INSTRUCTIONS", label: "Instructions" },
      { key: "STUDENT_WORK", label: `Student Work` },
    ];

    return (
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "960px", margin: "0 auto" }}>
        {/* Tab bar */}
        <div style={{
          display: "flex",
          gap: "4px",
          backgroundColor: "#eef0f3",
          borderRadius: "8px",
          padding: "3px",
          marginBottom: "24px",
          width: "fit-content",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "6px 18px",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: activeTab === tab.key ? "600" : "500",
                color: activeTab === tab.key ? "#2d5be3" : "#6b7280",
                backgroundColor: activeTab === tab.key ? "#ffffff" : "transparent",
                cursor: "pointer",
                boxShadow: activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Instructions tab */}
        {activeTab === "INSTRUCTIONS" && (
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e6ea",
            borderRadius: "10px",
            borderTop: "3px solid #d97706",
            padding: "24px 26px",
          }}>
            <AssignmentInfo />
          </div>
        )}

        {/* Student Work tab */}
        {activeTab === "STUDENT_WORK" && (
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            {/* Main area — selected submission */}
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              <div style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e6ea",
                borderRadius: "10px",
                padding: "24px",
                minHeight: "260px",
              }}>
                {selectedSubmission ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: 0 }}>
                        {selectedSubmission.studentName}
                      </h3>
                      <span style={{ fontSize: "11.5px", color: "#9ca3af" }}>
                        Submitted {new Date(selectedSubmission.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Submitted files */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                      {selectedSubmission.files?.map((f) => (
                        <a
                          key={f.id}
                          href={`${config.API_BASE_URL}/assignment-submissions/files/${f.id}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 12px",
                            backgroundColor: "#eef2fc",
                            border: "1px solid #d6e4fc",
                            borderRadius: "7px",
                            textDecoration: "none",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#dce8f9"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#eef2fc"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <span style={{ fontSize: "13px", color: "#2d5be3", fontWeight: "500" }}>{f.fileName}</span>
                        </a>
                      ))}
                    </div>

                    {/* Grading section */}
                    <div style={{ borderTop: "1px solid #e2e6ea", paddingTop: "18px" }}>
                      <p style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", margin: "0 0 12px", letterSpacing: "0.1px" }}>Grading</p>

                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                        <div style={{ width: "120px" }}>
                          <label style={{ display: "block", fontSize: "11.5px", color: "#6b7280", margin: "0 0 5px", fontWeight: "500" }}>Grade</label>
                          <input
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="e.g. 85"
                            style={{ ...inputStyle, width: "100%" }}
                            onFocus={e => e.target.style.borderColor = "#2d5be3"}
                            onBlur={e => e.target.style.borderColor = "#d1d5db"}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "11.5px", color: "#6b7280", margin: "0 0 5px", fontWeight: "500" }}>Feedback</label>
                          <input
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Optional feedback..."
                            style={{ ...inputStyle, width: "100%" }}
                            onFocus={e => e.target.style.borderColor = "#2d5be3"}
                            onBlur={e => e.target.style.borderColor = "#d1d5db"}
                          />
                        </div>

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
                          style={{
                            padding: "9px 20px",
                            backgroundColor: "#059669",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "7px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#047857"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#059669"}
                        >
                          Save Grade
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "180px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "10px",
                        backgroundColor: "#eef2fc", display: "flex",
                        alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Select a student to view their submission</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar — student list */}
            <div style={{ width: "210px", flexShrink: 0 }}>
              <div style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e6ea",
                borderRadius: "10px",
                padding: "14px",
              }}>
                <p style={{ fontSize: "11.5px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 10px" }}>
                  Students ({submissions.length})
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {submissions.map((s) => {
                    const isSelected = selectedSubmission?.id === s.id;
                    const isGraded = s.grade != null && s.grade !== "";
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSubmission(s)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: "7px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "#eef2fc" : "transparent",
                          border: isSelected ? "1px solid #d6e4fc" : "1px solid transparent",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <span style={{ fontSize: "13px", color: isSelected ? "#2d5be3" : "#374151", fontWeight: isSelected ? "600" : "500" }}>
                          {s.studentName}
                        </span>
                        {isGraded && (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#059669",
                            backgroundColor: "#ecfdf5",
                            padding: "2px 7px",
                            borderRadius: "10px",
                          }}>
                            {s.grade}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {submissions.length === 0 && (
                    <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", padding: "20px 0", margin: 0 }}>No submissions yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default AssignmentDetail;