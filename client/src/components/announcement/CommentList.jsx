function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No comments yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className="border rounded p-3 bg-gray-50"
        >
          <p className="text-gray-800 text-sm">
            {c.content}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
