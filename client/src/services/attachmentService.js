import apiFetch from "./api";

// Get attachments for a specific announcement
export function getAttachmentsByAnnouncement(announcementId) {
  return apiFetch(`/attachments/announcement/${announcementId}`);
}

// View attachment (PDF opens inline)
export function viewAttachment(attachmentId) {
  return apiFetch(`/attachments/${attachmentId}/view`);
}
