import apiFetch from "./api";

// Student submits assignment (text / file later)
export function submitAssignment(data) {
  return apiFetch("/assignments/submit", {
    method: "POST",
    body: data,
  });
}

// Teacher views all submissions for an assignment
export function getSubmissionsByAssignment(announcementId) {
  return apiFetch(`/assignments/${announcementId}/submissions`);
}
