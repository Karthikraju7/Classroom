import apiFetch from "./api";

// Create a course (teacher)
export function createCourse(data) {
  return apiFetch("/courses/create", {
    method: "POST",
    body: data,
  });
}

// Join a course (student)
export function joinCourse(courseId, userId) {
  return apiFetch(`/courses/${courseId}/join`, {
    method: "POST",
    body: { userId },
  });
}

export function getCourseById(courseId) {
  return apiFetch(`/courses/${courseId}`);
}

export const getAllCourses = (userId) =>
  apiFetch(`/courses?userId=${userId}`);

export const getTeacherCourses = (userId) =>
  apiFetch(`/courses/teacher?userId=${userId}`);

export const getStudentCourses = (userId) =>
  apiFetch(`/courses/student?userId=${userId}`);
