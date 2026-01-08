import apiFetch from "./api";

export function submitAssignment(formData) {
  return apiFetch("/assignments/submit", {
    method: "POST",
    body: formData,
    isMultipart: true,
  });
}


export function getSubmissionsByAssignment(announcementId, userId) {
  return apiFetch(
    `/assignments/${announcementId}/submissions?userId=${userId}`
  );
}


export function gradeSubmission(submissionId, userId, grade, feedback) {
  const params = new URLSearchParams({
    userId,
    grade,
  });

  if (feedback) params.append("feedback", feedback);

  return apiFetch(
    `/assignments/submissions/${submissionId}/grade?${params.toString()}`,
    { method: "PUT" }
  );
}

export async function getMySubmission(announcementId, userId) {
  return apiFetch(
    `/assignments/${announcementId}/my-submission?userId=${userId}`
  );
}
