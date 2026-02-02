function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p style={{ fontSize: "12.5px", color: "#9ca3af", margin: "10px 0 0" }}>
        No comments yet
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            borderRadius: "8px",
            border: "1px solid #eef0f3",
            padding: "10px 12px",
            backgroundColor: "#f8f9fb",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#1a1d23", margin: 0 }}>
              {c.authorName}
            </p>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, whiteSpace: "nowrap", marginLeft: "12px" }}>
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>

          <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, lineHeight: "1.5", wordBreak: "break-word" }}>
            {c.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;