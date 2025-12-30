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
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Attachments</h1>

      {loading ? (
        <p className="text-gray-500">Loading attachments...</p>
      ) : attachments.length === 0 ? (
        <p className="text-gray-500">No attachments found</p>
      ) : (
        <div className="space-y-3">
          {attachments.map(att => (
            <AttachmentItem key={att.id} attachment={att} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Attachments;
