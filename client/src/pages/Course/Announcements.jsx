import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import {
  getAnnouncementsByCourse,
  createAnnouncement,
} from "../../services/announcementService";
import AnnouncementCard from "../../components/announcement/AnnouncementCard";
import AnnouncementForm from "../../components/announcement/AnnouncementForm";

function Announcements() {
  const { courseId } = useParams();
  const { role } = useCourse();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAnnouncements();
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

  async function handleCreate(data) {
    try {
      await createAnnouncement({
        ...data,
        courseId,
      });
      setShowForm(false);
      loadAnnouncements();
    } catch (err) {
      console.error("Failed to create announcement", err);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Announcements</h1>

        {role === "TEACHER" && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && role === "TEACHER" && (
        <AnnouncementForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;
