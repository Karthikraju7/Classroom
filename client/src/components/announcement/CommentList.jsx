function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No comments yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {comments.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border px-4 py-2 bg-gray-50"
        >
          <p className="text-sm font-medium text-gray-900">
            {c.authorName}
          </p>

          <p className="text-sm text-gray-800 wrap-break-word">
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
