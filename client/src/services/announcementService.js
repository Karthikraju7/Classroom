import apiFetch from "./api";

// Create announcement
export function createAnnouncement(data) {
  return apiFetch("/announcements", {
    method: "POST",
    body: data,
  });
}

// Get all announcements for a course
export function getAnnouncementsByCourse(courseId) {
  return apiFetch(`/announcements/course/${courseId}`);
}

// Get only assignment announcements for a course
export function getAssignmentsByCourse(courseId) {
  return apiFetch(`/announcements/course/${courseId}/assignments`);
}
