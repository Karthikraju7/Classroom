import { useState } from "react";
import { createCourse } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

function CreateCourseModal({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleCreate() {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createCourse({
        name,
        description,
        userId: user.id,
      });
      onClose();
    } catch (err) {
      console.error("Failed to create course", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-lg font-semibold">Create Course</h2>
        <input
          required
          className="w-full border p-2"
          placeholder="Course name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Description(optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="cursor-pointer">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;
