function MessageItem({ message, onRead }) {
  return (
    <div
      onClick={() => onRead(message.id)}
      className={`border rounded p-3 cursor-pointer ${
        message.readAt ? "bg-white" : "bg-blue-50"
      }`}
    >
      <p className="text-sm text-gray-800">
        {message.content}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {new Date(message.createdAt).toLocaleString()}
        {!message.readAt && " • Unread"}
      </p>
    </div>
  );
}

export default MessageItem;
