import { useEffect, useState } from "react";
import {
  getCommentsByAnnouncement,
  createComment,
} from "../../services/commentService";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { useAuth } from "../../context/AuthContext";

function AnnouncementCard({ announcement }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { user } = useAuth();
  const [showAllComments, setShowAllComments] = useState(false);
  const visibleComments = showAllComments
                          ? comments
                          : comments.slice(0, 1);


  useEffect(() => {
    loadComments();
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
    <div className="border rounded p-4 bg-white space-y-3">
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
        <p className="text-gray-700">{announcement.content}</p>
      )}

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
      <div className="pt-3 border-t space-y-2">
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
