import apiFetch from "./api";

// Student submits assignment
export function submitAssignment(data) {
  return apiFetch("/assignments/submit", {
    method: "POST",
    body: data,
    isMultipart: true,
  });
}
// All submissions
export function getSubmissionsByAssignment(announcementId) {
  return apiFetch(`/assignments/${announcementId}/submissions`);
}
