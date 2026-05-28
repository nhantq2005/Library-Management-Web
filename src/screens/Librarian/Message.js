
import React, { useState, useEffect, useRef } from "react";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import moment from "moment";
import { ref, push, onValue, query, orderByChild } from "firebase/database";
import { database } from "../../utils/FirebaseConfig";

const Message = () => {

  const [userList, setUserList] = useState([]); // Danh sách user đã chat
  const [activeUserId, setActiveUserId] = useState(null); // User đang chọn để chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  // Lấy danh sách user đã chat (threadId dạng {userId}_LIBRARIAN)
  useEffect(() => {
    const chatsRef = ref(database, "chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const users = [];
      snapshot.forEach(child => {
        const threadKey = child.key;
        if (threadKey && threadKey.endsWith("_LIBRARIAN")) {
          const userId = threadKey.replace("_LIBRARIAN", "");
          let userName = userId;
          let lastMessage = null;
          let lastTimestamp = 0;
          const messagesSnap = child.child("messages");
          messagesSnap.forEach(msgSnap => {
            const msg = msgSnap.val();
            // Lấy tên user từ tin nhắn đầu tiên gửi bởi user
            if (msg.senderId === userId && msg.senderName) {
              userName = msg.senderName;
            }
            // Tìm tin nhắn mới nhất
            if (msg.timestamp && msg.timestamp > lastTimestamp) {
              lastTimestamp = msg.timestamp;
              lastMessage = msg;
            }
            return false;
          });
          users.push({ userId, userName, lastMessage });
        }
      });
      // Sắp xếp theo thời gian tin nhắn mới nhất (desc)
      users.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
      setUserList(users);
      if (users.length > 0 && !activeUserId) setActiveUserId(users[0].userId);
    });
    return () => unsubscribe();
  }, [activeUserId]);

  // Tạo threadId từ activeUserId
  const threadId = activeUserId ? `${activeUserId}_LIBRARIAN` : null;

  // Lắng nghe tin nhắn của user đang chọn
  useEffect(() => {
    if (!threadId) return;
    const messagesRef = query(ref(database, `chats/${threadId}/messages`), orderByChild('timestamp'));
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const msgs = [];
      snapshot.forEach(child => {
        msgs.push({ id: child.key, ...child.val() });
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [threadId]);

  // 2. Cuộn xuống cuối
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Gửi tin nhắn lên Firebase
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !threadId) return;

    const messagesRef = ref(database, `chats/${threadId}/messages`);
    push(messagesRef, {
        senderId: "LIBRARIAN",
        senderName: "Admin Thư viện",
        content: input,
        timestamp: Date.now()
    });
    
    setInput("");
  };

  // --- STYLES GIỮ NGUYÊN NHƯ CŨ ---
  const styles = {
    container: { backgroundColor: "#F9FAFB", minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "32px", fontFamily: "'Inter', sans-serif" },
    card: { width: "100%",height: "100%", border: "1px solid #E5E7EB", borderRadius: "4px", boxShadow: "none", display: "flex", flexDirection: "column", overflow: "hidden" },
    header: { backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "16px 24px" },
    chatBody: { flex: 1, overflowY: "auto", padding: "24px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "20px" },
    bubbleRow: (isMe) => ({ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", width: "100%" }),
    bubble: (isMe) => ({ maxWidth: "85%", padding: "10px 16px", borderRadius: "4px", backgroundColor: isMe ? "#1D559F" : "#F9FAFB", color: isMe ? "#FFFFFF" : "#111827", border: isMe ? "none" : "1px solid #E5E7EB", fontSize: "0.875rem" }),
    senderName: { fontSize: "0.7rem", fontWeight: "600", color: "#6B7280", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" },
    footer: { backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "16px 24px" },
    input: { backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "4px", padding: "10px 14px", fontSize: "0.875rem", boxShadow: "none" },
    sendButton: { backgroundColor: "#1D559F", border: "none", borderRadius: "4px", padding: "0 24px", fontWeight: "500", fontSize: "0.875rem", transition: "all 0.2s" }
  };

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar: Danh sách user đã chat */}
      <div style={{ width: '20%', background: '#fff', borderRight: '1px solid #E5E7EB', padding: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', fontWeight: 700, fontSize: '1.1rem', color: '#1D559F', letterSpacing: '-0.5px' }}>
          Người dùng đã nhắn
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {userList.length === 0 && <div style={{ color: '#9CA3AF', padding: 24 }}>Chưa có cuộc trò chuyện nào.</div>}
          {userList.map(u => (
            <div
              key={u.userId}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #F3F4F6',
                background: activeUserId === u.userId ? '#EFF6FF' : '#fff',
                cursor: 'pointer',
                fontWeight: activeUserId === u.userId ? 600 : 400,
                color: activeUserId === u.userId ? '#1D559F' : '#111827',
                transition: 'all 0.2s',
              }}
              onClick={() => setActiveUserId(u.userId)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>ID: {u.userId}</span>
                {u.lastMessage && (
                  <span style={{ fontSize: '0.85rem', color: '#374151', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                    <b>{u.lastMessage.senderName || u.userName}:</b> {u.lastMessage.content} <span style={{ color: '#9CA3AF', fontWeight: 400, marginLeft: 4 }}>{moment(u.lastMessage.timestamp).format('HH:mm')}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Card style={styles.card}>
          <Card.Header style={styles.header}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: "36px", height: "36px", backgroundColor: "#EFF6FF", color: "#1D559F", borderRadius: "4px" }} className="d-flex align-items-center justify-content-center fw-bold">💬</div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ color: "#111827", fontSize: "1rem" }}>Hỗ trợ trực tuyến (Admin)</h5>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.75rem", color: "#059669" }}>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "50%" }}></span>
                  Đang hoạt động
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body style={styles.chatBody}>
            {messages.length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center' }}>Chưa có tin nhắn.</div>}
            {messages.map((msg) => {
              const isMe = msg.senderId === "LIBRARIAN";
              return (
                <div key={msg.id} style={styles.bubbleRow(isMe)}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                    {!isMe && <span style={styles.senderName}>{msg.senderName}</span>}
                    <div style={styles.bubble(isMe)}>
                      <p style={{ margin: 0, lineHeight: "1.5" }}>{msg.content}</p>
                    </div>
                    <span style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "4px" }}>
                        {msg.timestamp ? moment(msg.timestamp).format("HH:mm") : ""}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </Card.Body>
          <Card.Footer style={styles.footer}>
            <Form onSubmit={handleSend} style={{ margin: 0 }}>
              <InputGroup style={{ alignItems: 'stretch' }}>
                <Form.Control
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  style={{ ...styles.input, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
                  disabled={!activeUserId}
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  style={{
                    ...styles.sendButton,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    marginLeft: 0,
                    height: '100%'
                  }}
                  disabled={!input.trim() || !activeUserId}
                >
                  Gửi
                </Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Message;