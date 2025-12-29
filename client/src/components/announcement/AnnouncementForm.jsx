import { useState } from "react";

function AnnouncementForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("NORMAL");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      title,
      content,
      type,
      dueDate: type === "ASSIGNMENT" ? dueDate : null,
    });

    // reset
    setTitle("");
    setContent("");
    setType("NORMAL");
    setDueDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 space-y-4">
      <h2 className="font-semibold">Create Announcement</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full border rounded px-3 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Content"
        className="w-full border rounded px-3 py-2"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <select
        className="border rounded px-3 py-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="NORMAL">Normal</option>
        <option value="ASSIGNMENT">Assignment</option>
      </select>

      {type === "ASSIGNMENT" && (
        <input
          type="datetime-local"
          className="border rounded px-3 py-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Post
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AnnouncementForm;
