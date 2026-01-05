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

  if (loadingAnnouncement || !announcement) {
    return <p className="text-gray-500">Loading announcement...</p>;
  }

  return (
    <div className="space-y-6 bg-white border rounded p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {announcement.title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Posted on{" "}
          {new Date(announcement.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Content */}
      {announcement.content && (
        <p className="text-gray-700 whitespace-pre-line">
          {announcement.content}
        </p>
      )}

      {/* Attachments */}
      {loadingAttachments ? (
        <p className="text-sm text-gray-500">Loading attachments...</p>
      ) : attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((att) => (
            <AttachmentItem key={att.id} attachment={att} />
          ))}
        </div>
      ) : null}

      {/* Comments */}
      <div className="pt-4 border-t space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Comments
        </h2>
        <CommentForm onSubmit={handleAddComment} />

        {loadingComments ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : (
          <>
            <CommentList comments={visibleComments} />

            {comments.length > 1 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showAllComments
                  ? "Hide comments"
                  : `View all comments (${comments.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnnouncementDetail;
