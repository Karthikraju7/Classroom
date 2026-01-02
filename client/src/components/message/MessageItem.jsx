function MessageItem({
  message,
  currentUserId,
  currentUserName,
  isThread = false,
  isInbox = false,
  isMain = false,
  isReply = false,
  onOpen,
  onRead,
}) {
  const isUnread = !message.readAt;
  const isSentByMe = message.senderId === currentUserId;
  const senderLabel =
        message.senderId === currentUserId ? "You" : message.senderName;

  const recipientLabel =
    message.recipientNames?.map((name) =>
      name === currentUserName ? "You" : name
    ).join(", ");


  function handleClick() {
    if (isUnread) {
      onRead?.(message.id);
    }

    if (isThread && onOpen) {
      onOpen();
    }
  }

  return (
    <div
      onClick={() => {
        onRead?.(message.id);
        if (isThread) onOpen?.();
      }}
      className={`border rounded p-3 cursor-pointer
        ${isInbox ? "bg-blue-50" : ""}
        ${isMain ? "border-blue-500" : ""}
        ${isReply ? "ml-6 bg-gray-50" : ""}
      `}
    >
      {/* Sender */}
      <p className="text-xs text-gray-500 mb-1">
        {senderLabel}
        {" → "}
        {recipientLabel || "—"}
        {isMain}
        {isReply}
      </p>
      {/* Content */}
      <p className="text-sm text-gray-800">
        {message.content}
      </p>

      {/* Footer */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">
          {new Date(message.createdAt).toLocaleString()}
        </span>

        {isThread && (
          <span className="text-xs text-blue-600">
            Replies →
          </span>
        )}
      </div>
    </div>
  );
}

export default MessageItem;
