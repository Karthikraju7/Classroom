import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { getAnnouncementsByCourse } from "../../services/announcementService";
import { getAttachmentsByAnnouncement } from "../../services/attachmentService";
import AttachmentItem from "../../components/attachment/AttachmentItem";

function AnnouncementDetail() {
  const { courseId, announcementId } = useParams();
  const { role } = useCourse();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);


  useEffect(() => {
    loadAnnouncement();
  }, [announcementId]);

  useEffect(() => {
    if (announcement) {
      loadAttachments();
    }
  }, [announcement]);

  async function loadAnnouncement() {
    setLoading(true);
    try {
      const announcements = await getAnnouncementsByCourse(courseId);
      const found = announcements.find(
        (a) => a.id === Number(announcementId)
      );
      setAnnouncement(found);
    } catch (err) {
      console.error("Failed to load announcement", err);
    } finally {
      setLoading(false);
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

  if (loading || !announcement) {
    return <p className="text-gray-500">Loading announcement...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">
          {announcement.title}
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Posted on{" "}
          {new Date(announcement.createdAt).toLocaleString()}
        </p>

        {announcement.type === "ASSIGNMENT" &&
          announcement.dueDate && (
            <p className="text-red-600 mt-1">
              Due:{" "}
              {new Date(announcement.dueDate).toLocaleString()}
            </p>
          )}
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

    </div>
  );
}

export default AnnouncementDetail;
