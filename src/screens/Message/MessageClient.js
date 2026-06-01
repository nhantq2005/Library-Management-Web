import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import moment from "moment";
import { ref, push, onValue, query, orderByChild } from "firebase/database";
import { database } from "../../utils/FirebaseConfig";
import { MyUserContext } from "../../configs/Context";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const MessageClient = () => {
    const [user] = useContext(MyUserContext);
    const LIBRARIAN_ID = "LIBRARIAN";
    const threadId = user ? `${user.id}_${LIBRARIAN_ID}` : null;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messageEndRef = useRef(null);

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
        if (!input.trim() || !user) return;
        const messagesRef = ref(database, `chats/${threadId}/messages`);
        push(messagesRef, {
            senderId: user.id,
            senderName: user.last_name || user.username || "Bạn",
            content: input,
            timestamp: Date.now()
        });
        setInput("");
    };

    const styles = {
        container: {
            padding: "24px 32px",
            backgroundColor: "#F3F4F6",
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
        },
        titleText: {
            color: '#1F2937',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontSize: '1.25rem',
            margin: 0
        },
        chatWrapper: {
            display: "flex",
            height: "calc(100vh - 110px)",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
        },
        chatArea: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F9FAFB"
        },
        header: {
            padding: "16px 24px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        },
        messageBody: {
            flex: 1,
            padding: "24px",
            overflowY: "auto",
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
            width: "fit-content",
            padding: "10px 16px",

            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",

            background: isMe ? "linear-gradient(135deg, #1D559F 0%, #154078 100%)" : "#FFFFFF",
            color: isMe ? "#FFFFFF" : "#1F2937",
            border: isMe ? "none" : "1px solid #E5E7EB",
            fontSize: "0.925rem",
            lineHeight: "1.4",

            wordBreak: "break-word",
            whiteSpace: "pre-wrap",

            boxShadow: isMe ? "0 2px 4px rgba(29, 85, 159, 0.15)" : "0 1px 2px rgba(0,0,0,0.02)"
        }),
        footer: {
            padding: "16px 24px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #F3F4F6"
        },
        inputContainer: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#F3F4F6",
            borderRadius: "30px",
            padding: "4px 8px 4px 16px",
            border: "1px solid #E5E7EB"
        },
        input: {
            backgroundColor: "transparent",
            border: "none",
            padding: "10px 0",
            fontSize: "0.9rem",
            boxShadow: "none",
            color: "#1F2937"
        },
        sendButton: (disabled) => ({
            backgroundColor: disabled ? "#9CA3AF" : "#1D559F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "all 0.2s ease",
            cursor: disabled ? "not-allowed" : "pointer"
        })
    };

    return (
        <>
            <Header />
            <div style={styles.container}>


                <div style={styles.chatWrapper}>
                    <div style={styles.chatArea}>

                        <div style={styles.header}>
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ position: "relative" }}>
                                    <img
                                        src="https://ui-avatars.com/api/?name=Thủ+thư&background=EFF6FF&color=1D559F&bold=true"
                                        alt="Thủ thư"
                                        style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #EFF6FF" }}
                                    />
                                    <span style={{ position: "absolute", bottom: "2px", right: "2px", width: "10px", height: "10px", backgroundColor: "#10B981", borderRadius: "50%", border: "2px solid #FFFFFF" }}></span>
                                </div>
                                <div>
                                    <h6 style={{ margin: 0, fontWeight: "600", color: "#111827", fontSize: "0.95rem" }}>Hộp thoại hỗ trợ</h6>
                                    <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                                        Đội ngũ thư viện trực tuyến
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.messageBody}>
                            <div className="text-center my-1">
                                <span style={{ fontSize: "0.75rem", color: "#6B7280", backgroundColor: "#E5E7EB", padding: "4px 12px", borderRadius: "12px", fontWeight: "500" }}>
                                    Hôm nay
                                </span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id} style={styles.bubbleRow(isMe)}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                                            <div style={styles.bubble(isMe)}>
                                                {msg.content}
                                            </div>
                                            <span style={{
                                                fontSize: "0.7rem",
                                                color: "#9CA3AF",
                                                marginTop: "4px",
                                                paddingRight: isMe ? "4px" : "0px",
                                                paddingLeft: isMe ? "0px" : "4px"
                                            }}>
                                                {msg.timestamp ? moment(msg.timestamp).format("HH:mm") : ""}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messageEndRef} />
                        </div>

                        <div style={styles.footer}>
                            <Form onSubmit={handleSend}>
                                <div style={styles.inputContainer}>
                                    <Form.Control
                                        placeholder="Nhập tin nhắn đến thủ thư..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        style={styles.input}
                                    />
                                    <Button
                                        type="submit"
                                        style={styles.sendButton(!input.trim())}
                                        onMouseOver={e => { if (input.trim()) e.currentTarget.style.backgroundColor = "#154078"; }}
                                        onMouseOut={e => { if (input.trim()) e.currentTarget.style.backgroundColor = "#1D559F"; }}
                                        disabled={!input.trim()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ transform: "rotate(45deg)", marginRight: "-2px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </Button>
                                </div>
                            </Form>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MessageClient;