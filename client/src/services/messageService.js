import apiFetch from "./api";

// Send a message (student → teacher OR teacher → students)
export function sendMessage(data) {
  return apiFetch("/messages", {
    method: "POST",
    body: data,
  });
}

// Get messages for current user in a course
export function getMessages() {
  return apiFetch("/messages");
}

// Mark message as read
export function markMessageAsRead(messageId) {
  return apiFetch(`/messages/${messageId}/read`, {
    method: "POST",
  });
}
