import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnnouncementsByCourse } from "../../services/announcementService";
import { getAttachmentsByAnnouncement } from "../../services/attachmentService";
import AttachmentItem from "../../components/attachment/AttachmentItem";

function Attachments() {
  const { courseId } = useParams();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAttachments();
  }, [courseId]);

  async function loadAttachments() {
    setLoading(true);
    try {
      const announcements = await getAnnouncementsByCourse(courseId);

      const attachmentLists = await Promise.all(
        announcements.map(a =>
          getAttachmentsByAnnouncement(a.id)
        )
      );

      setAttachments(attachmentLists.flat());
    } catch (err) {
      console.error("Failed to load attachments", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>
          Attachments
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
          {attachments.length} {attachments.length === 1 ? "file" : "files"} across all announcements
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{
              width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
              borderTopColor: "#2d5be3", borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }} />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading attachments...</span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : attachments.length === 0 ? (
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: "0 0 6px" }}>No attachments found</p>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Files posted in announcements will appear here.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e6ea",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          {attachments.map(att => (
            <AttachmentItem key={att.id} attachment={att} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Attachments;