import { useEffect, useState } from "react";
import { useCourse } from "../../context/CourseContext";
import {
  getMessages,
  sendMessage,
  markMessageAsRead,
} from "../../services/messageService";
import MessageItem from "../../components/message/MessageItem";
import MessageForm from "../../components/message/MessageForm";

function Messages() {
  const { role } = useCourse();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(content) {
    setSending(true);
    try {
      await sendMessage({ content });
      loadMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  }

  async function handleRead(messageId) {
    try {
      await markMessageAsRead(messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, readAt: new Date().toISOString() } : m
        )
      );
    } catch (err) {
      console.error("Failed to mark message as read", err);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Messages</h1>

      {/* Info */}
      {role === "STUDENT" && (
        <p className="text-sm text-gray-600">
          You can message only the instructor. Messages are private.
        </p>
      )}

      {role === "TEACHER" && (
        <p className="text-sm text-gray-600">
          Messages are sent privately to selected students.
        </p>
      )}

      {/* Message list */}
      {loading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages yet</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <MessageItem
              key={m.id}
              message={m}
              onRead={handleRead}
            />
          ))}
        </div>
      )}

      {/* Send message */}
      <div className="border-t pt-4">
        <MessageForm onSubmit={handleSend} />
        {sending && (
          <p className="text-xs text-gray-400 mt-1">Sending…</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
