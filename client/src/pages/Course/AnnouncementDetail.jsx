import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCommentsByAnnouncement,
  createComment,
} from "../../services/commentService";
import { getAnnouncementsByCourse } from "../../services/announcementService";
import { getAttachmentsByAnnouncement } from "../../services/attachmentService";
import AttachmentItem from "../../components/attachment/AttachmentItem";
import CommentList from "../../components/announcement/CommentList";
import CommentForm from "../../components/announcement/CommentForm";
import { useAuth } from "../../context/AuthContext";

function AnnouncementDetail() {
  const { courseId, announcementId } = useParams();
  const { user } = useAuth();

  const [announcement, setAnnouncement] = useState(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const visibleComments = showAllComments
    ? comments
    : comments.slice(0, 1);

  useEffect(() => {
    loadAnnouncement();
  }, [announcementId]);

  useEffect(() => {
    if (announcement) {
      loadAttachments();
      loadComments();
    }
  }, [announcement]);

  async function loadAnnouncement() {
    setLoadingAnnouncement(true);
    try {
      const data = await getAnnouncementsByCourse(courseId);
      const found = data.find(
        (a) => a.id === Number(announcementId)
      );
      setAnnouncement(found);
    } catch (err) {
      console.error("Failed to load announcement", err);
    } finally {
      setLoadingAnnouncement(false);
    }
  }

  async function loadAttachments() {
    setLoadingAttachments(true);
    try {
      const data = await getAttachmentsByAnnouncement(announcement.id);
      setAttachments(data);
    } catch (err) {
      console.error("Failed to load attachments", err);
    } finally {
      setLoadingAttachments(false);
    }
  }

  async function loadComments() {
    setLoadingComments(true);
    try {
      const data = await getCommentsByAnnouncement(announcement.id);
      setComments([...data].reverse());
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleAddComment(content) {
    try {
      await createComment(announcement.id, {
        userId: user.id,
        content,
      });
      loadComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  }

  // Loading state
  if (loadingAnnouncement || !announcement) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
            borderTopColor: "#2d5be3", borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading announcement...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAssignment = announcement.type === "ASSIGNMENT";

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" }}>
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e6ea",
        borderRadius: "10px",
        overflow: "hidden",
      }}>
        {/* Top accent bar for assignments */}
        {isAssignment && (
          <div style={{ height: "3px", backgroundColor: "#d97706" }} />
        )}

        <div style={{ padding: "28px 30px 30px" }}>
          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <h1 style={{
                fontSize: "21px",
                fontWeight: "600",
                color: "#1a1d23",
                margin: 0,
                letterSpacing: "-0.3px",
                lineHeight: "1.3",
              }}>
                {announcement.title}
              </h1>

              {isAssignment && (
                <span style={{
                  fontSize: "11.5px",
                  fontWeight: "600",
                  color: "#d97706",
                  backgroundColor: "#fef3c7",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  Assignment
                </span>
              )}
            </div>

            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "8px 0 0" }}>
              Posted on {new Date(announcement.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Due date */}
          {announcement.dueDate && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "7px",
              padding: "8px 12px",
              marginBottom: "20px",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600", margin: 0 }}>
                Due: {new Date(announcement.dueDate).toLocaleString()}
              </p>
            </div>
          )}

          {/* Content */}
          {announcement.content && (
            <p style={{
              fontSize: "14px",
              color: "#4b5563",
              margin: "0 0 22px",
              lineHeight: "1.7",
              whiteSpace: "pre-line",
            }}>
              {announcement.content}
            </p>
          )}

          {/* Attachments */}
          {loadingAttachments ? (
            <p style={{ fontSize: "12.5px", color: "#9ca3af", margin: "0 0 20px" }}>Loading attachments...</p>
          ) : attachments.length > 0 ? (
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", margin: "0 0 8px", letterSpacing: "0.1px" }}>
                Attachments
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {attachments.map((att) => (
                  <AttachmentItem key={att.id} attachment={att} />
                ))}
              </div>
            </div>
          ) : null}

          {/* Comments section */}
          <div style={{ borderTop: "1px solid #e2e6ea", paddingTop: "22px" }}>
            <p style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1d23",
              margin: "0 0 12px",
              letterSpacing: "-0.1px",
            }}>
              Comments {comments.length > 0 && (
                <span style={{ fontWeight: "400", color: "#9ca3af" }}>({comments.length})</span>
              )}
            </p>

            <CommentForm onSubmit={handleAddComment} />

            {loadingComments ? (
              <p style={{ fontSize: "12.5px", color: "#9ca3af", marginTop: "12px" }}>Loading comments...</p>
            ) : (
              <>
                <CommentList comments={visibleComments} />

                {comments.length > 1 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2d5be3",
                      fontSize: "12.5px",
                      fontWeight: "500",
                      cursor: "pointer",
                      padding: "8px 0 0",
                      display: "block",
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >
                    {showAllComments ? "Hide comments" : `View all comments (${comments.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetail;