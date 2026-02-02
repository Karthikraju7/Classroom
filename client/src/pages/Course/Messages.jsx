import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { useAuth } from "../../context/AuthContext";
import {
  getInbox,
  getThreadMessages,
  sendMessage,
  markMessageAsRead,
} from "../../services/messageService";
import { getCourseMembers } from "../../services/courseService";
import MessageItem from "../../components/message/MessageItem";
import MessageForm from "../../components/message/MessageForm";

function Messages() {
  const { courseId } = useParams();
  const { role } = useCourse();
  const { user } = useAuth();
  const userId = user.id;
  const currentUserName = user.name;
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    loadInbox();
  }, [courseId]);

  async function loadInbox() {
    setLoading(true);
    try {
      const data = await getInbox(courseId, userId);
      setThreads(data);
    } catch (err) {
      console.error("Failed to load inbox", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (role === "TEACHER") {
      fetchStudents();
    }
  }, [courseId]);

  async function fetchStudents() {
    const data = await getCourseMembers(courseId);
    setStudents(data.filter(m => m.role === "STUDENT"));
  }

  async function openThread(threadId) {
    setActiveThreadId(threadId);
    try {
      const data = await getThreadMessages(courseId, threadId, userId);
      setThreadMessages(data);
    } catch (err) {
      console.error("Failed to load thread", err);
    }
  }

  async function handleSend({ content }) {
    if (!activeThreadId) return;

    await sendMessage(courseId, userId, {
      content,
      threadId: activeThreadId,
    });

    openThread(activeThreadId);
  }

  // Threads
  const mainMessage = threadMessages.find((m) => m.id === m.threadId);
  const replies = threadMessages
    .filter((m) => m.id !== m.threadId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.3px" }}>
            {activeThreadId ? "Thread" : "Messages"}
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
            {activeThreadId
              ? "You are viewing a thread"
              : role === "STUDENT"
                ? "You can message only the instructor."
                : "Messages are private and sent individually."}
          </p>
        </div>

        {role === "TEACHER" && !activeThreadId && !showCompose && (
          <button
            onClick={() => setShowCompose(true)}
            style={{
              padding: "8px 18px",
              backgroundColor: "#2d5be3",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Message
          </button>
        )}
      </div>

      {/* Compose form */}
      {showCompose && (
        <div style={{ marginTop: "20px" }}>
          <MessageForm
            students={students}
            onSend={async ({ content, recipientIds }) => {
              await sendMessage(courseId, userId, {
                content,
                recipientIds,
                threadId: null,
              });
              setShowCompose(false);
              loadInbox();
            }}
            onCancel={() => setShowCompose(false)}
          />
        </div>
      )}

      {/* Inbox list */}
      {!activeThreadId && !showCompose && (
        <div style={{ marginTop: "20px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{
                  width: "18px", height: "18px", border: "2.5px solid #e2e6ea",
                  borderTopColor: "#2d5be3", borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }} />
                <span style={{ fontSize: "14px", color: "#6b7280" }}>Loading messages...</span>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : threads.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "72px 20px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e2e6ea",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                backgroundColor: "#eef2fc", display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d5be3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a1d23", margin: "0 0 6px" }}>No messages yet</p>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                {role === "TEACHER" ? "Send a new message to a student to get started." : "Your instructor hasn't sent you any messages yet."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {threads.map((t) => (
                <MessageItem
                  key={t.id}
                  message={t}
                  currentUserId={userId}
                  currentUserName={currentUserName}
                  isThread
                  isInbox
                  onOpen={() => openThread(t.threadId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thread view */}
      {activeThreadId && (
        <div style={{ marginTop: "20px" }}>
          {/* Back button */}
          <button
            onClick={() => { setActiveThreadId(null); setThreadMessages([]); }}
            style={{
              background: "none",
              border: "none",
              color: "#2d5be3",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              padding: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to inbox
          </button>

          {/* Main message */}
          {mainMessage && (
            <MessageItem
              message={mainMessage}
              currentUserId={userId}
              currentUserName={currentUserName}
              isMain
            />
          )}

          {/* Replies */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            {replies.map((m) => (
              <MessageItem
                key={m.id}
                message={m}
                currentUserId={userId}
                currentUserName={currentUserName}
                isReply
              />
            ))}
          </div>

          {/* Reply form */}
          <div style={{ borderTop: "1px solid #e2e6ea", marginTop: "20px", paddingTop: "18px" }}>
            <MessageForm isReply onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;