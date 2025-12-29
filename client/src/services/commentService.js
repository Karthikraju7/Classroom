import apiFetch from "./api";

// Create a comment under an announcement
export function createComment(data) {
  return apiFetch("/comments", {
    method: "POST",
    body: data,
  });
}

// Get comments for an announcement
export function getCommentsByAnnouncement(announcementId) {
  return apiFetch(`/comments/${announcementId}`);
}
