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
  const { user } = useAuth(); // TEMP auth
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
  const mainMessage = threadMessages.find(
    (m) => m.id === m.threadId
  );

  const replies = threadMessages
    .filter((m) => m.id !== m.threadId)
    .sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Messages</h1>

        {role === "TEACHER" && !activeThreadId && (
          <button
            onClick={() => setShowCompose(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm cursor-pointer"
          >
            New Message
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {role === "STUDENT"
          ? "You can message only the instructor."
          : "Messages are private and sent individually."}
      </p>

      {showCompose && (
        <div className="border rounded p-4 space-y-3">
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


      {/* Inbox */}
      {!activeThreadId && !showCompose && (
        <>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : threads.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {threads.map((t) => {
                  const isMain = t.id === t.threadId;

                  return (
                    <MessageItem
                      message={t}
                      currentUserId={userId}
                      currentUserName={currentUserName}
                      isThread
                      isInbox
                      onOpen={() => openThread(t.threadId)}
                    />
                  );
              })}
            </div>
          )}
        </>
      )}

      {/* Total thread */}
      {activeThreadId && (
        <>
          <button
            className="text-sm text-blue-600 cursor-pointer"
            onClick={() => {
              setActiveThreadId(null);
              setThreadMessages([]);
            }}
          >
            ← Back to inbox
          </button>

          <div className="space-y-4">
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
        </>
      )}

      {/* SEND / REPLY */}
      {activeThreadId && (
          <div className="border-t pt-4">
            <MessageForm
              isReply
              onSend={handleSend}
            />
          </div>
        )}
    </div>
  );
}

export default Messages;