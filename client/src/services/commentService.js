import apiFetch from "./api";

// Create a comment under an announcement
export function createComment(announcementId, data) {
  return apiFetch(`/announcements/${announcementId}/comments`, {
    method: "POST",
    body: data,
  });
}

// Get comments for an announcement
export function getCommentsByAnnouncement(announcementId) {
  return apiFetch(`/announcements/${announcementId}/comments`);
}
