import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Card } from "react-bootstrap";
import moment from "moment";
import { ref, push, onValue, query, orderByChild } from "firebase/database";
import { database } from "../../utils/FirebaseConfig";

// Import các style từ file MessageStyle.js tách rời
import {
  mainContainer,
  sidebarContainer,
  sidebarHeader,
  sidebarBody,
  chatAreaWrapper,
  cardStyle,
  headerStyle,
  chatBodyStyle,
  bubbleRow,
  bubble,
  senderNameStyle,
  footerStyle,
  inputStyle,
  sendButtonStyle
} from "../../style/MessageStyle";

const Message = () => {
  const [userList, setUserList] = useState([]); 
  const [activeUserId, setActiveUserId] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

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
            if (msg.senderId === userId && msg.senderName) {
              userName = msg.senderName;
            }
            if (msg.timestamp && msg.timestamp > lastTimestamp) {
              lastTimestamp = msg.timestamp;
              lastMessage = msg;
            }
            return false;
          });
          users.push({ userId, userName, lastMessage });
        }
      });
      users.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
      setUserList(users);
      if (users.length > 0 && !activeUserId) setActiveUserId(users[0].userId);
    });
    return () => unsubscribe();
  }, [activeUserId]);

  const threadId = activeUserId ? `${activeUserId}_LIBRARIAN` : null;

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

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <div style={mainContainer}>
      {/* Sidebar: Danh sách user đã chat */}
      <div style={sidebarContainer}>
        <div style={sidebarHeader}>
          Người dùng đã nhắn
        </div>
        <div style={sidebarBody}>
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
      <div style={chatAreaWrapper}>
        <Card style={cardStyle}>
          <Card.Header style={headerStyle}>
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

          <Card.Body style={chatBodyStyle}>
            {messages.length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center' }}>Chưa có tin nhắn.</div>}
            {messages.map((msg) => {
              const isMe = msg.senderId === "LIBRARIAN";
              return (
                <div key={msg.id} style={bubbleRow(isMe)}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                    {!isMe && <span style={senderNameStyle}>{msg.senderName}</span>}
                    <div style={bubble(isMe)}>
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

          <Card.Footer style={footerStyle}>
            <Form onSubmit={handleSend} style={{ margin: 0 }}>
              <div className="d-flex w-100 align-items-stretch">
                <Form.Control
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  style={inputStyle}
                  disabled={!activeUserId}
                  autoComplete="off"
                />
                <Button
  type="submit"
  style={{
    ...sendButtonStyle,
    backgroundColor: (!input.trim() || !activeUserId) ? "#A5B4FC" : sendButtonStyle.backgroundColor
  }}
  disabled={!input.trim() || !activeUserId}
>
  Gửi
</Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Message;