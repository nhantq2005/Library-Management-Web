import React, { useState, useEffect, useRef } from "react";
import { Button, Form, InputGroup, Card } from "react-bootstrap";

const Message = () => {
  const [messages, setMessages] = useState([
    { sender: "Admin", content: "Chào mừng bạn đến với hệ thống tin nhắn!" },
    { sender: "Bạn", content: "Chào Admin, mình cần hỗ trợ về tài liệu Premium." },
    { sender: "Admin", content: "Bạn cứ gửi câu hỏi nhé, mình sẽ giải đáp ngay." }
  ]);
  const [input, setInput] = useState("");
  
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

  // --- LUMINA DESIGN SYSTEM STYLES ---
  const styles = {
    container: {
      backgroundColor: "#F9FAFB",
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      fontFamily: "'Inter', sans-serif"
    },
    card: {
      width: "100%",
      maxWidth: "750px",
      height: "600px",
      border: "1px solid #E5E7EB", // Viền mảnh Lumina
      borderRadius: "4px",
      boxShadow: "none", // Bỏ bóng đổ
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    header: {
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #E5E7EB",
      padding: "16px 24px"
    },
    chatBody: {
      flex: 1,
      overflowY: "auto",
      padding: "24px",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    bubbleRow: (isMe) => ({
      display: "flex",
      justifyContent: isMe ? "flex-end" : "flex-start",
      width: "100%"
    }),
    bubble: (isMe) => ({
      maxWidth: "85%",
      padding: "10px 16px",
      borderRadius: "4px", // Góc bo vuông vức
      backgroundColor: isMe ? "#1D559F" : "#F9FAFB",
      color: isMe ? "#FFFFFF" : "#111827",
      border: isMe ? "none" : "1px solid #E5E7EB",
      fontSize: "0.875rem"
    }),
    senderName: {
      fontSize: "0.7rem",
      fontWeight: "600",
      color: "#6B7280",
      marginBottom: "4px",
      display: "block",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    },
    footer: {
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid #E5E7EB",
      padding: "16px 24px"
    },
    input: {
      backgroundColor: "#F9FAFB",
      border: "1px solid #E5E7EB",
      borderRadius: "4px",
      padding: "10px 14px",
      fontSize: "0.875rem",
      boxShadow: "none"
    },
    sendButton: {
      backgroundColor: "#1D559F",
      border: "none",
      borderRadius: "4px",
      padding: "0 24px",
      fontWeight: "500",
      fontSize: "0.875rem",
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
              style={{ width: "36px", height: "36px", backgroundColor: "#EFF6FF", color: "#1D559F", borderRadius: "4px" }}
              className="d-flex align-items-center justify-content-center fw-bold"
            >
              💬
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ color: "#111827", fontSize: "1rem" }}>Hỗ trợ trực tuyến</h5>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.75rem", color: "#059669" }}>
                <span style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "50%" }}></span>
                Đang hoạt động
              </div>
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
                  {!isMe && <span style={styles.senderName}>{msg.sender}</span>}
                  <div style={styles.bubble(isMe)}>
                    <p style={{ margin: 0, lineHeight: "1.5" }}>{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#154078"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#1D559F"; }}
              >
                Gửi
              </Button>
            </InputGroup>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Message;