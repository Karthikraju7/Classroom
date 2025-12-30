import { useState } from "react";

function AnnouncementForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("NORMAL");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState([]);

  function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      title,
      content,
      type,
      dueDate: type === "ASSIGNMENT" ? dueDate : null,
    })
  );

  files.forEach((file) => {
    formData.append("files", file);
  });

  onSubmit(formData);

  // reset
  setTitle("");
  setContent("");
  setType("NORMAL");
  setDueDate("");
  setFiles([]);
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

      {/* File upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label
            htmlFor="files"
            className="px-4 py-2 border rounded cursor-pointer bg-white hover:bg-gray-100 text-sm"
          >
            Upload files
          </label>

          <input
            id="files"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files);

              setFiles((prev) => {
                const existing = new Set(prev.map(f => f.name));
                const newFiles = selected.filter(f => !existing.has(f.name));
                return [...prev, ...newFiles];
              });

              e.target.value = ""; // allow re-select
            }}
          />

          {files.length > 0 && (
            <span className="text-sm text-gray-600">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        {/* Selected files list */}
        {files.length > 0 && (
          <ul className="space-y-1">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between text-sm text-gray-700 border rounded px-3 py-1"
              >
                <span className="truncate">{file.name}</span>

                <button
                  type="button"
                  onClick={() =>
                    setFiles(prev => prev.filter((_, i) => i !== idx))
                  }
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
