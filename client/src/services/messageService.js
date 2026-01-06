import apiFetch from "./api";

export function sendMessage(courseId, userId, data) {
  return apiFetch(
    `/courses/${courseId}/messages?userId=${userId}`,
    {
      method: "POST",
      body: data,
    }
  );
}

export function getInbox(courseId, userId) {
  return apiFetch(
    `/courses/${courseId}/messages/inbox?userId=${userId}`
  );
}

export function getThreadMessages(courseId, threadId, userId) {
  return apiFetch(
    `/courses/${courseId}/messages/thread/${threadId}?userId=${userId}`
  );
}

export function markMessageAsRead(courseId, messageId, userId) {
  return apiFetch(
    `/courses/${courseId}/messages/${messageId}/read?userId=${userId}`,
    {
      method: "POST",
    }
  );
}
