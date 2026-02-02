import { useState } from "react";

function AnnouncementForm({
  courseId,
  userId,
  students = [],
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("NORMAL");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState([]);

  // visibility control
  const [visibility, setVisibility] = useState("ALL"); 
  const [selectedIds, setSelectedIds] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        courseId,
        userId,
        title,
        content,
        type,
        dueDate: type === "ASSIGNMENT" ? dueDate : null,
        recipientIds:
          visibility === "SELECTED" && selectedIds.length > 0
            ? selectedIds
            : null,
      })
    );

    files.forEach((file) => {
      formData.append("files", file);
    });

    onSubmit(formData);

    // reset
    setTitle("");
    setContent("");
    setType("NORMAL");
    setDueDate("");
    setFiles([]);
    setVisibility("ALL");
    setSelectedIds([]);
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "#1a1d23",
    backgroundColor: "#fafbfc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12.5px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    letterSpacing: "0.1px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e6ea",
        borderRadius: "10px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      {/* Form header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1d23", margin: 0, letterSpacing: "-0.2px" }}>
            Create Announcement
          </h2>
          <p style={{ fontSize: "12.5px", color: "#6b7280", margin: "4px 0 0" }}>
            Fill in the details and post to your course.
          </p>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>
          Title <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Midterm Exam Details"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "#2d5be3"}
          onBlur={e => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      {/* Type selector */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>Type</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {["NORMAL", "ASSIGNMENT"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={{
                padding: "7px 16px",
                border: `1.5px solid ${type === t ? "#2d5be3" : "#d1d5db"}`,
                borderRadius: "7px",
                backgroundColor: type === t ? "#eef2fc" : "#fafbfc",
                color: type === t ? "#2d5be3" : "#6b7280",
                fontSize: "13px",
                fontWeight: type === t ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {t === "NORMAL" ? "Normal" : "Assignment"}
            </button>
          ))}
        </div>
      </div>

      {/* Due date  */}
      {type === "ASSIGNMENT" && (
        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>
            Due Date <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#2d5be3"}
            onBlur={e => e.target.style.borderColor = "#d1d5db"}
          />
        </div>
      )}

      {/* Visibility */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>Visible To</label>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { value: "ALL", label: "All students" },
            { value: "SELECTED", label: "Selected students" },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151", cursor: "pointer" }}
            >
              <div
                onClick={() => {
                  setVisibility(opt.value);
                  if (opt.value === "ALL") setSelectedIds([]);
                }}
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: `2px solid ${visibility === opt.value ? "#2d5be3" : "#d1d5db"}`,
                  backgroundColor: visibility === opt.value ? "#2d5be3" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {visibility === opt.value && (
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#fff" }} />
                )}
              </div>
              <span onClick={() => {
                setVisibility(opt.value);
                if (opt.value === "ALL") setSelectedIds([]);
              }}>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Student checkboxes */}
        {visibility === "SELECTED" && (
          <div style={{
            marginTop: "10px",
            border: "1.5px solid #e2e6ea",
            borderRadius: "8px",
            padding: "12px 14px",
            maxHeight: "160px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {students.map((s) => (
              <label
                key={s.userId}
                style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151", cursor: "pointer" }}
              >
                <div
                  onClick={() => {
                    setSelectedIds((prev) =>
                      prev.includes(s.userId)
                        ? prev.filter((id) => id !== s.userId)
                        : [...prev, s.userId]
                    );
                  }}
                  style={{
                    width: "17px",
                    height: "17px",
                    borderRadius: "4px",
                    border: `2px solid ${selectedIds.includes(s.userId) ? "#2d5be3" : "#d1d5db"}`,
                    backgroundColor: selectedIds.includes(s.userId) ? "#2d5be3" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {selectedIds.includes(s.userId) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span onClick={() => {
                  setSelectedIds((prev) =>
                    prev.includes(s.userId)
                      ? prev.filter((id) => id !== s.userId)
                      : [...prev, s.userId]
                  );
                }}>{s.userName}</span>
              </label>
            ))}

            {students.length === 0 && (
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>No students found</p>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>Content</label>
        <textarea
          placeholder="Write your announcement here..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={e => e.target.style.borderColor = "#2d5be3"}
          onBlur={e => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      {/* File upload */}
      <div style={{ marginBottom: "22px" }}>
        <label style={labelStyle}>Attachments</label>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label
            htmlFor="files"
            style={{
              padding: "8px 16px",
              border: "1.5px solid #d1d5db",
              borderRadius: "7px",
              backgroundColor: "#fafbfc",
              fontSize: "13px",
              fontWeight: "500",
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d5be3"; e.currentTarget.style.backgroundColor = "#eef2fc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fafbfc"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload files
          </label>

          <input
            id="files"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              const selected = Array.from(e.target.files);
              setFiles((prev) => {
                const existing = new Set(prev.map((f) => f.name));
                const newFiles = selected.filter((f) => !existing.has(f.name));
                return [...prev, ...newFiles];
              });
              e.target.value = "";
            }}
          />

          {files.length > 0 && (
            <span style={{ fontSize: "12.5px", color: "#6b7280" }}>
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #e2e6ea",
                  borderRadius: "7px",
                  padding: "8px 12px",
                  backgroundColor: "#fafbfc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "240px" }}>
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
        <button
          type="submit"
          style={{
            padding: "9px 22px",
            backgroundColor: "#2d5be3",
            color: "#ffffff",
            border: "none",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
        >
          Post Announcement
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "9px 18px",
            backgroundColor: "transparent",
            color: "#6b7280",
            border: "1px solid #e2e6ea",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f3f4f6"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AnnouncementForm;