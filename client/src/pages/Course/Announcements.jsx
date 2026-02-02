import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import {
  getAnnouncementsByCourse,
  createAnnouncement,
} from "../../services/announcementService";
import { getCourseMembers } from "../../services/courseService";
import AnnouncementCard from "../../components/announcement/AnnouncementCard";
import AnnouncementForm from "../../components/announcement/AnnouncementForm";
import { useAuth } from "../../context/AuthContext";

function Announcements() {
  const { courseId } = useParams();
  const { role } = useCourse();
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAnnouncements();
    loadStudents();
  }, [courseId]);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const data = await getAnnouncementsByCourse(courseId);
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    try {
      const members = await getCourseMembers(courseId);
      const onlyStudents = members.filter((m) => m.role === "STUDENT");
      setStudents(onlyStudents);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  }

  async function handleCreate(formData) {
    try {
      await createAnnouncement(formData);
      setShowForm(false);
      loadAnnouncements();
    } catch (err) {
      console.error("Failed to create announcement", err);
    }
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>
            Announcements
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
            {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"}
          </p>
        </div>

        {role === "TEACHER" && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "8px 18px",
              backgroundColor: "#2d5be3",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && role === "TEACHER" && (
        <AnnouncementForm
          courseId={Number(courseId)}
          userId={user.id}
          students={students}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{
              width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
              borderTopColor: "#2d5be3", borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }} />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading announcements...</span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : announcements.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "72px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e2e6ea",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            backgroundColor: "#eef2fc", display: "flex",
            alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: "0 0 6px" }}>No announcements yet</p>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            {role === "TEACHER" ? "Create your first announcement to get started." : "Your teacher hasn't posted anything yet."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;