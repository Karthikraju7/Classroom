import { useEffect, useState } from "react";
import {
  getCommentsByAnnouncement,
  createComment,
} from "../../services/commentService";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { useAuth } from "../../context/AuthContext";
import { getAttachmentsByAnnouncement } from "../../services/attachmentService";
import AttachmentItem from "../../components/attachment/AttachmentItem";
import { useNavigate, useParams } from "react-router-dom";


function AnnouncementCard({ announcement }) {
  function getPreview(text, limit = 150) {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  }
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const { user } = useAuth();
  const [showAllComments, setShowAllComments] = useState(false);
  const visibleComments = showAllComments
                          ? comments
                          : comments.slice(0, 1);
  const navigate = useNavigate();
  const { courseId } = useParams();

  function openDetail() {
    if (announcement.type === "ASSIGNMENT") {
      navigate(`/courses/${courseId}/assignments/${announcement.id}`);
    } else {
      navigate(`/courses/${courseId}/announcements/${announcement.id}`);
    }
  }



  useEffect(() => {
    loadComments();
    loadAttachments();
  }, [announcement.id]);

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

  return (
    <div
        onClick={openDetail}
        className="border rounded p-4 bg-white space-y-3 cursor-pointer hover:bg-gray-50"
      >

      {/* Announcement header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{announcement.title}</h2>

        {announcement.type === "ASSIGNMENT" && (
          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
            Assignment
          </span>
        )}
      </div>

      {/* Content */}
      {announcement.content && (
        <p className="text-gray-700">
          {getPreview(announcement.content)}
        </p>
      )}


      {loadingAttachments ? (
        <p className="text-sm text-gray-500">Loading attachments...</p>
      ) : attachments.length > 0 ? (
        <div
          className="space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          {attachments.map((att) => (
            <AttachmentItem key={att.id} attachment={att} />
          ))}
        </div>
      ) : null}

      {/* Due date */}
      {announcement.dueDate && (
        <p className="text-sm text-red-600">
          Due: {new Date(announcement.dueDate).toLocaleString()}
        </p>
      )}

      {/* Meta */}
      <p className="text-xs text-gray-400">
        Posted on {new Date(announcement.createdAt).toLocaleString()}
      </p>

      {/* Comments */}
      <div
        className="pt-3 border-t space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <CommentForm onSubmit={handleAddComment} />
        {loadingComments ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : (
          <>
            <CommentList comments={visibleComments} />

            {comments.length > 1 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
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

export default AnnouncementCard;
