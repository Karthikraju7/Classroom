function AttachmentItem({ attachment }) {
  function handleOpen() {
    window.open(
      `http://localhost:8080/attachments/${attachment.id}/view`,
      "_blank"
    );
  }

  return (
    <div
      onClick={handleOpen}
      className="flex justify-between items-center border rounded p-3 cursor-pointer hover:bg-gray-50"
    >
      <div>
        <p className="font-medium">{attachment.fileName}</p>
        <p className="text-xs text-gray-500">
          {attachment.fileType} • {Math.round(attachment.fileSize / 1024)} KB
        </p>
      </div>

      <span className="text-blue-600 text-sm">Open</span>
    </div>
  );
}

export default AttachmentItem;
