const API_BASE = "http://localhost:8080/api/live";

export const startLiveClass = async (courseId, userId) => {
  const res = await fetch(
    `${API_BASE}/start/${courseId}?userId=${userId}`,
    { method: "POST" }
  );
  return res.json();
};

export const getActiveSession = async (courseId) => {
  const res = await fetch(`${API_BASE}/active/${courseId}`);
  return res.json();
};

export const endLiveClass = async (roomId, userId) => {
  await fetch(
    `${API_BASE}/end/${roomId}?userId=${userId}`,
    { method: "POST" }
  );
};