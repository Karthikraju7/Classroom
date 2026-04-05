import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useCourse } from "../../context/CourseContext";
import { useAuth } from "../../context/AuthContext";
import apiFetch from "../../services/api";

const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const WS_URL = "http://127.0.0.1:8080/ws";

function getInitials(id) {
  if (id === null || id === undefined) return "?";
  return (
    String(id)
      .split(/[@._\s]/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

// ── useLocalMedia ──────────────────────────────────────────────────────────────
function useLocalMedia() {
  const streamRef = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [mediaError, setMediaError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const c of [{ video: true, audio: true }, { video: false, audio: true }]) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(c);
          if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
          streamRef.current = stream;
          return;
        } catch { /* try next */ }
      }
      if (!cancelled) setMediaError("Camera / microphone unavailable.");
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const toggleMic = useCallback(() => {
    const t = streamRef.current?.getAudioTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setIsMicOn(t.enabled);
  }, []);

  const toggleCam = useCallback(() => {
    const t = streamRef.current?.getVideoTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setIsCamOn(t.enabled);
  }, []);

  return { streamRef, isMicOn, isCamOn, mediaError, toggleMic, toggleCam };
}

// ── VideoTile ──────────────────────────────────────────────────────────────────
function VideoTile({ stream, label, isMuted = false, isLocal = false, isMicOn = true, large = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream ?? null;
  }, [stream]);

  const hasLive = stream?.getVideoTracks().some((t) => t.enabled && t.readyState === "live");
  const initials = getInitials(label);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-gray-900 border border-white/10 ${large ? "rounded-2xl" : "rounded-xl"} w-full h-full`}>
      {hasLive ? (
        <video ref={videoRef} autoPlay playsInline muted={isMuted} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full bg-gray-800/60">
          <div className={`rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold select-none ${large ? "w-24 h-24 text-3xl" : "w-12 h-12 text-base"}`}>
            {initials}
          </div>
          {large && <span className="text-gray-300 text-sm font-medium">{String(label ?? "")}</span>}
        </div>
      )}
      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
        <span className="text-white text-xs font-medium truncate max-w-[200px]">
          {String(label ?? "")}
          {isLocal && <span className="text-gray-400 ml-1">(You)</span>}
        </span>
        {!isMicOn && (
          <span className="ml-auto text-red-400 shrink-0">
            <MicOffIcon size={12} />
          </span>
        )}
      </div>
    </div>
  );
}

// ── CtrlBtn ────────────────────────────────────────────────────────────────────
function CtrlBtn({ onClick, off = false, danger = false, label, children, disabled = false }) {
  const base = "flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border text-xs font-medium select-none transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-w-[68px]";
  const variant = danger
    ? "bg-red-500 border-red-600 text-white hover:bg-red-600"
    : off
    ? "bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20"
    : "bg-gray-800 border-gray-700 text-gray-200 hover:border-blue-500 hover:text-blue-400";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variant}`}>
      {children}
      <span>{label}</span>
    </button>
  );
}

// ── ConfirmModal ───────────────────────────────────────────────────────────────
function ConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">End Session?</h3>
            <p className="text-gray-400 text-xs mt-0.5">This will disconnect all participants.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LiveClass() {
  const { roomId, courseId } = useParams();
  const { role } = useCourse();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isTeacher = role === "TEACHER";
  const myId = String(user?.id ?? user?.email ?? "anonymous");

  const { streamRef, isMicOn, isCamOn, mediaError, toggleMic, toggleCam } = useLocalMedia();

  const peersRef = useRef(new Map());
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const iceQueuesRef = useRef(new Map());

  const stompRef = useRef(null);
  const isConnectedRef = useRef(false);
  const mountedRef = useRef(true);

  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("connecting");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endingSession, setEndingSession] = useState(false);

  // ── peer helpers ─────────────────────────────────────────────────────────────
  const flushIce = useCallback(async (peerId, pc) => {
    for (const c of iceQueuesRef.current.get(peerId) ?? []) {
      try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ignore */ }
    }
    iceQueuesRef.current.set(peerId, []);
  }, []);

  const removePeer = useCallback((peerId) => {
    peersRef.current.get(peerId)?.pc.close();
    peersRef.current.delete(peerId);
    iceQueuesRef.current.delete(peerId);
    setRemoteStreams((p) => { const n = new Map(p); n.delete(peerId); return n; });
    setParticipants((p) => p.filter((x) => x.id !== peerId));
  }, []);

  const createPeer = useCallback((peerId) => {
    if (peersRef.current.has(peerId)) return peersRef.current.get(peerId).pc;
    const pc = new RTCPeerConnection(ICE_SERVERS);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => pc.addTrack(t, streamRef.current));
    }
    pc.onicecandidate = ({ candidate }) => {
      if (!candidate) return;
      stompRef.current?.send("/app/ice", {}, JSON.stringify({ type: "ice", roomId, sender: myId, target: peerId, candidate }));
    };
    pc.oniceconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState)) removePeer(peerId);
    };
    pc.ontrack = ({ streams }) => {
      if (!mountedRef.current) return;
      setRemoteStreams((p) => new Map(p).set(peerId, streams[0]));
    };
    peersRef.current.set(peerId, { pc });
    iceQueuesRef.current.set(peerId, []);
    return pc;
  }, [roomId, myId, streamRef, removePeer]);

  // ── cleanup helper (shared by leave + end) ────────────────────────────────────
  const cleanupSession = useCallback(() => {
    mountedRef.current = false;
    peersRef.current.forEach(({ pc }) => pc.close());
    peersRef.current.clear();
    iceQueuesRef.current.clear();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (stompRef.current && isConnectedRef.current) {
      stompRef.current.disconnect();
      isConnectedRef.current = false;
    }
  }, [streamRef]);

  // ── STOMP + signaling ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !roomId) return;
    mountedRef.current = true;
    if (isConnectedRef.current) return;

    const stomp = Stomp.over(new SockJS(WS_URL));
    stomp.debug = () => {};
    stompRef.current = stomp;

    stomp.connect({}, () => {
      if (!mountedRef.current) return;
      isConnectedRef.current = true;
      setStatus("connected");

      stomp.subscribe(`/topic/${roomId}`, async (msg) => {
        if (!mountedRef.current) return;
        let data;
        try { data = JSON.parse(msg.body); } catch { return; }
        const peerId = String(data.sender ?? "");
        if (!peerId || peerId === myId) return;

        switch (data.type) {
          case "join": {
            setParticipants((p) =>
              p.find((x) => x.id === peerId) ? p : [...p, { id: peerId, role: data.senderRole ?? "STUDENT" }]
            );
            if (!isTeacher) return;
            const pc = createPeer(peerId);
            if (pc.signalingState !== "stable") return;
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              stomp.send("/app/offer", {}, JSON.stringify({ type: "offer", roomId, sender: myId, target: peerId, offer }));
            } catch (e) { console.error("Offer error:", e); }
            break;
          }
          case "offer": {
            const ex = peersRef.current.get(peerId)?.pc;
            if (ex && ex.signalingState !== "stable") return;
            if (ex) { ex.close(); peersRef.current.delete(peerId); setRemoteStreams((p) => { const n = new Map(p); n.delete(peerId); return n; }); }
            const pc = createPeer(peerId);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
              await flushIce(peerId, pc);
              if (pc.signalingState !== "have-remote-offer") return;
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              stomp.send("/app/answer", {}, JSON.stringify({ type: "answer", roomId, sender: myId, target: peerId, answer }));
            } catch (e) { console.error("Answer error:", e); }
            break;
          }
          case "answer": {
            const pc = peersRef.current.get(peerId)?.pc;
            if (!pc || pc.signalingState !== "have-local-offer") return;
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              await flushIce(peerId, pc);
            } catch (e) { console.error("SRD answer error:", e); }
            break;
          }
          case "ice": {
            const pc = peersRef.current.get(peerId)?.pc;
            if (!pc?.remoteDescription?.type) {
              const q = iceQueuesRef.current.get(peerId) ?? [];
              q.push(data.candidate);
              iceQueuesRef.current.set(peerId, q);
            } else {
              try { await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); } catch { /* ignore */ }
            }
            break;
          }
        }
      });

      stomp.send("/app/join", {}, JSON.stringify({ type: "join", roomId, sender: myId, senderRole: role }));
    });

    return () => {
      mountedRef.current = false;
      peersRef.current.forEach(({ pc }) => pc.close());
      peersRef.current.clear();
      iceQueuesRef.current.clear();
      if (stompRef.current && isConnectedRef.current) {
        stompRef.current.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [user, roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Leave (student / teacher leaving without ending) ──────────────────────────
  const handleLeave = useCallback(() => {
    cleanupSession();
    navigate(`/courses/${courseId}/announcements`, { replace: true });
  }, [cleanupSession, navigate, courseId]);

  // ── End Session (teacher only) ────────────────────────────────────────────────
  const handleEndSession = useCallback(async () => {
    setEndingSession(true);
    try {
      await apiFetch(`/api/live/end/${roomId}?userId=${myId}`, { method: "POST" });
    } catch (e) {
      console.error("End session API failed:", e);
      // Still clean up locally even if API fails
    } finally {
      cleanupSession();
      setEndingSession(false);
      setShowEndConfirm(false);
      navigate(`/courses/${courseId}/announcements`, { replace: true });
    }
  }, [roomId, myId, cleanupSession, navigate, courseId]);

  // ── Build tile list ───────────────────────────────────────────────────────────
  const localStream = streamRef.current ?? null;
  const remoteEntries = [...remoteStreams.entries()];
  const hasRemote = remoteEntries.length > 0;

  // Status bar config
  const statusCfg = {
    connected:    { dot: "bg-emerald-400 animate-pulse", text: "text-emerald-400", label: "Live" },
    connecting:   { dot: "bg-amber-400 animate-bounce",  text: "text-amber-400",   label: "Connecting…" },
    disconnected: { dot: "bg-red-400",                   text: "text-red-400",     label: "Disconnected" },
  };
  const sc = statusCfg[status] ?? statusCfg.connecting;

  return (
    // fixed inset-0 so it escapes CourseLayout's padded <main>
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-950 text-gray-100 overflow-hidden">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 h-14 bg-gray-900 border-b border-gray-800 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-lg select-none">◈</span>
          <span className="font-mono text-xs text-gray-400 tracking-wide">
            Room <span className="text-gray-200">{roomId}</span>
          </span>
        </div>

        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${sc.text}`}>
          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
          {sc.label}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-blue-400">
            {isTeacher ? "Teacher" : "Student"}
          </span>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle participants"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <PeopleIcon size={16} />
          </button>
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── VIDEO AREA ────────────────────────────────────────────────── */}
        <main className="relative flex-1 overflow-hidden bg-gray-950 p-3">
          {mediaError && (
            <div className="mb-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500 text-red-400 text-sm text-center">
              ⚠️ {mediaError}
            </div>
          )}

          {/* ── Layout: 1 remote → large main + pip self. Multiple → grid ── */}
          {!hasRemote ? (
            // Only local — centered full area
            <div className="w-full h-full">
              <VideoTile stream={localStream} label={myId} isMuted isLocal isMicOn={isMicOn} large />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mt-40">Waiting for others to join…</p>
                </div>
              </div>
            </div>
          ) : remoteEntries.length === 1 ? (
            // 1 remote → spotlight layout
            <div className="w-full h-full relative">
              {/* Main video — remote */}
              <div className="w-full h-full">
                <VideoTile stream={remoteEntries[0][1]} label={remoteEntries[0][0]} isMicOn large />
              </div>
              {/* PiP — self */}
              <div className="absolute bottom-4 right-4 w-44 h-32 rounded-xl overflow-hidden shadow-2xl border border-white/20 z-10">
                <VideoTile stream={localStream} label={myId} isMuted isLocal isMicOn={isMicOn} />
              </div>
            </div>
          ) : (
            // Multiple remotes → grid (local is smaller PiP bottom-right)
            <div className="w-full h-full relative">
              <div className={`grid gap-2 h-full ${
                remoteEntries.length === 2 ? "grid-cols-2" :
                remoteEntries.length <= 4 ? "grid-cols-2" : "grid-cols-3"
              }`}>
                {remoteEntries.map(([id, stream]) => (
                  <VideoTile key={id} stream={stream} label={id} isMicOn large />
                ))}
              </div>
              {/* PiP self */}
              <div className="absolute bottom-4 right-4 w-44 h-32 rounded-xl overflow-hidden shadow-2xl border border-white/20 z-10">
                <VideoTile stream={localStream} label={myId} isMuted isLocal isMicOn={isMicOn} />
              </div>
            </div>
          )}
        </main>

        {/* ── PARTICIPANTS SIDEBAR ───────────────────────────────────────── */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-800">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Participants</span>
              <span className="text-[11px] font-bold bg-blue-500 text-white rounded-full px-2 py-0.5">
                {1 + participants.length}
              </span>
            </div>

            <ul className="flex-1 overflow-y-auto py-1">
              {/* Me */}
              <li className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[13px] font-semibold shrink-0">
                  {getInitials(myId)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{myId}</p>
                  <p className="text-[11px] text-gray-500">{isTeacher ? "Teacher" : "Student"}</p>
                </div>
                <div className="flex gap-1 text-red-400 shrink-0">
                  {!isMicOn && <MicOffIcon size={12} />}
                  {!isCamOn && <CamOffIcon size={12} />}
                </div>
              </li>

              {participants.length > 0 && <li className="mx-4 my-1 border-t border-gray-800/80" />}

              {participants.length === 0 ? (
                <li className="px-4 py-5 text-xs text-gray-600 text-center italic">
                  No one else is here yet…
                </li>
              ) : (
                participants.map(({ id, role: pRole }) => (
                  <li key={id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[13px] font-semibold shrink-0">
                      {getInitials(id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{String(id)}</p>
                      <p className="text-[11px] text-gray-500">{pRole ?? "Student"}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </aside>
        )}
      </div>

      {/* ── CONTROL BAR ───────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-900 border-t border-gray-800 shrink-0">
        <CtrlBtn onClick={toggleMic} off={!isMicOn} label={isMicOn ? "Mute" : "Unmute"}>
          {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
        </CtrlBtn>

        <CtrlBtn onClick={toggleCam} off={!isCamOn} label={isCamOn ? "Stop Video" : "Start Video"}>
          {isCamOn ? <CamOnIcon /> : <CamOffIcon />}
        </CtrlBtn>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-700 mx-1" />

        {isTeacher ? (
          // Teacher: Leave + End Session
          <>
            <CtrlBtn onClick={handleLeave} label="Leave">
              <LeaveIcon />
            </CtrlBtn>
            <CtrlBtn onClick={() => setShowEndConfirm(true)} danger label="End Session">
              <EndIcon />
            </CtrlBtn>
          </>
        ) : (
          // Student: just Leave
          <CtrlBtn onClick={handleLeave} danger label="Leave">
            <PhoneOffIcon />
          </CtrlBtn>
        )}
      </footer>

      {/* ── END SESSION CONFIRM MODAL ──────────────────────────────────────── */}
      {showEndConfirm && (
        <ConfirmModal
          onConfirm={handleEndSession}
          onCancel={() => setShowEndConfirm(false)}
          loading={endingSession}
        />
      )}
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function MicOnIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
}
function MicOffIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
}
function CamOnIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
}
function CamOffIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h1a2 2 0 0 1 2 2v9.34"/><polygon points="23 7 16 12 23 17 23 7"/></svg>;
}
function PhoneOffIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 2 2 0 0 1-.29-.22M6.29 6.29a2 2 0 0 0-.57 1.4v.06a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L4.69 13.9A16 16 0 0 1 2 10.5v-.5a2 2 0 0 1 2-2h2.18"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function PeopleIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function LeaveIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
function EndIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
}