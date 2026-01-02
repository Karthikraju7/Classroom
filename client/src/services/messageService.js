import apiFetch from "./api";

/**
 * SEND NEW MESSAGE or REPLY
 *
 * New thread  → do NOT send threadId
 * Reply       → send threadId
 */
export function sendMessage(courseId, userId, data) {
  return apiFetch(
    `/courses/${courseId}/messages?userId=${userId}`,
    {
      method: "POST",
      body: data,
    }
  );
}

/**
 * GET INBOX (one row per thread)
 */
export function getInbox(courseId, userId) {
  return apiFetch(
    `/courses/${courseId}/messages/inbox?userId=${userId}`
  );
}

/**
 * GET FULL THREAD (main + replies)
 */
export function getThreadMessages(courseId, threadId, userId) {
  return apiFetch(
    `/courses/${courseId}/messages/thread/${threadId}?userId=${userId}`
  );
}

/**
 * MARK MESSAGE AS READ
 */
export function markMessageAsRead(courseId, messageId, userId) {
  return apiFetch(
    `/courses/${courseId}/messages/${messageId}/read?userId=${userId}`,
    {
      method: "POST",
    }
  );
}
