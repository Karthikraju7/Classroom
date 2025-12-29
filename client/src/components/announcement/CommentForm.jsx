import { useState } from "react";

function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit(content);
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-1 border rounded px-3 py-2 text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
      >
        Post
      </button>
    </form>
  );
}

export default CommentForm;
