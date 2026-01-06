import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import CourseLayout from "../pages/Course/CourseLayout";
import Auth from "../pages/Auth/Auth";
import AnnouncementDetail from "../pages/Course/AnnouncementDetail";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/*"
        element={
          <ProtectedRoute>
            <CourseLayout />
          </ProtectedRoute>
        }
      >
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
