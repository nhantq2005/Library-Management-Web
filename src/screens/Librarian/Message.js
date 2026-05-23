import React, { useState, useEffect, useRef } from "react";
import { Button, Form, InputGroup, Card } from "react-bootstrap";

const Message = () => {
  const [messages, setMessages] = useState([
    { sender: "Admin", content: "Chào mừng bạn đến với hệ thống tin nhắn!" },
    { sender: "Bạn", content: "Chào Admin, mình cần hỗ trợ về tài liệu Premium." },
    { sender: "Admin", content: "Bạn cứ gửi câu hỏi nhé, mình sẽ giải đáp ngay." }
  ]);
  const [input, setInput] = useState("");
  
  // Ref để xử lý tự động cuộn xuống tin nhắn mới nhất
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "Bạn", content: input }]);
    setInput("");
  };

  // Định nghĩa style tái sử dụng nội bộ
  const styles = {
    container: {
      // padding: "32px",
      backgroundColor: "#f8fafc",
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    card: {
      width: "100%",
      maxWidth: "750px",
      height: "600px",
      border: "0",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    header: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #f1f5f9",
      padding: "18px 24px"
    },
    chatBody: {
      flex: 1,
      overflowY: "auto",
      padding: "24px",
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    },
    bubbleRow: (isMe) => ({
      display: "flex",
      justifyContent: isMe ? "flex-end" : "flex-start",
      width: "100%"
    }),
    bubble: (isMe) => ({
      maxWidth: "100%",
      padding: "12px 18px",
      borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      backgroundColor: isMe ? "#4f46e5" : "#ffffff",
      color: isMe ? "#ffffff" : "#1e293b",
      boxShadow: isMe ? "0 4px 12px rgba(79, 70, 229, 0.25)" : "0 2px 8px rgba(0, 0, 0, 0.02)",
      border: isMe ? "none" : "1px solid #e2e8f0"
    }),
    senderName: {
      fontSize: "0.75rem",
      fontWeight: "700",
      color: "#64748b",
      marginBottom: "4px",
      display: "block",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    messageContent: {
      fontSize: "0.95rem",
      margin: 0,
      lineHeight: "1.45"
    },
    footer: {
      backgroundColor: "#ffffff",
      borderTop: "1px solid #f1f5f9",
      padding: "16px 24px"
    },
    input: {
      backgroundColor: "#f1f5f9",
      border: "none",
      borderRadius: "12px",
      padding: "12px 20px",
      fontSize: "0.95rem",
      boxShadow: "none"
    },
    sendButton: {
      backgroundColor: "#4f46e5",
      border: "none",
      borderRadius: "12px",
      padding: "0 24px",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
      transition: "all 0.2s"
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        {/* HEADER CHAT */}
        <Card.Header style={styles.header}>
          <div className="d-flex align-items-center gap-3">
            <div 
              style={{ width: "42px", height: "42px", backgroundColor: "#e0e7ff", color: "#4f46e5", borderRadius: "50%" }}
              className="d-flex align-items-center justify-content-center fw-bold shadow-sm"
            >
              💬
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ color: "#0f172a" }}>Hỗ trợ trực tuyến</h5>
              <small className="text-success d-flex align-items-center gap-1 fw-medium">
                <span style={{ width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
                Đang hoạt động
              </small>
            </div>
          </div>
        </Card.Header>

        {/* NỘI DUNG TIN NHẮN */}
        <Card.Body style={styles.chatBody}>
          {messages.map((msg, idx) => {
            const isMe = msg.sender === "Bạn";
            return (
              <div key={idx} style={styles.bubbleRow(isMe)}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                  {/* Không cần hiển thị tên "Bạn" liên tục để UI gọn hơn, chỉ hiện tên đối phương */}
                  {!isMe && <span style={styles.senderName}>{msg.sender}</span>}
                  
                  <div style={styles.bubble(isMe)}>
                    <p style={styles.messageContent}>{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Điểm neo để tự động cuộn */}
          <div ref={messageEndRef} />
        </Card.Body>

        {/* KHUNG NHẬP CHAT */}
        <Card.Footer style={styles.footer}>
          <Form onSubmit={handleSend}>
            <InputGroup className="gap-2">
              <Form.Control
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={styles.input}
              />
              <Button 
                type="submit" 
                style={styles.sendButton}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}
              >
                Gửi ✨
              </Button>
            </InputGroup>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Message;