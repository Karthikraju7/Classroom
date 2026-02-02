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
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "1.5px solid #d1d5db",
          borderRadius: "7px",
          fontSize: "13px",
          color: "#1a1d23",
          backgroundColor: "#fafbfc",
          outline: "none",
          transition: "border-color 0.15s ease",
          fontFamily: "inherit",
        }}
        onFocus={e => e.target.style.borderColor = "#2d5be3"}
        onBlur={e => e.target.style.borderColor = "#d1d5db"}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "#2d5be3",
          color: "#ffffff",
          border: "none",
          borderRadius: "7px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
      >
        Post
      </button>
    </form>
  );
}

export default CommentForm;