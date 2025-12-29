import { useState } from "react";

function MessageForm({ onSubmit }) {
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit(content);
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        rows={3}
        placeholder="Write your message..."
        className="w-full border rounded px-3 py-2 text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
      >
        Send
      </button>
    </form>
  );
}

export default MessageForm;
