import { useState } from "react";

function MessageForm({
  students = [],
  isReply = false,
  onSend,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isReply && selectedIds.length === 0) {
      alert("Select at least one student");
      return;
    }

    onSend({
      content,
      recipientIds: isReply ? null : selectedIds,
    });

    setContent("");
    setSelectedIds([]);
  }


  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 space-y-4">
      {!isReply && (
      <div>
      <p className="text-sm font-medium mb-2">To</p>

      <div className="border rounded p-3 max-h-40 overflow-y-auto space-y-2">
        {students.map((s) => (
          <label
            key={s.userId}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(s.userId)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds((prev) => [...prev, s.userId]);
                } else {
                  setSelectedIds((prev) =>
                    prev.filter((id) => id !== s.userId)
                  );
                }
              }}
            />
            <span>{s.userName}</span>
          </label>
        ))}

        {students.length === 0 && (
          <p className="text-xs text-gray-500">No students found</p>
        )}
      </div>
    </div>
  )}


      <textarea
        rows={4}
        placeholder={isReply ? "Write your reply..." : "Write a new message..."}
        className="w-full border rounded px-3 py-2 text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-sm cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm cursor-pointer"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
