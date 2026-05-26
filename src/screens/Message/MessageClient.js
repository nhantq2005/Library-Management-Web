import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, Button, Badge } from "react-bootstrap";
import moment from "moment";

const MessageClient = () => {
    // --- MOCK DATA ---
    const [contacts, setContacts] = useState([
        { id: 1, name: "Admin Thư viện", role: "Hỗ trợ", unread: 0, lastMessage: "Bạn cứ gửi câu hỏi nhé.", isOnline: true, avatar: "https://ui-avatars.com/api/?name=Admin&background=EFF6FF&color=1D559F" },
        { id: 2, name: "Nguyễn Văn A", role: "Sinh viên", unread: 2, lastMessage: "Mình muốn gia hạn sách này được không?", isOnline: true, avatar: "https://ui-avatars.com/api/?name=Nguyen+A&background=F3F4F6&color=4B5563" },
        { id: 3, name: "Trần Thị B", role: "Giảng viên", unread: 0, lastMessage: "Cảm ơn em.", isOnline: false, avatar: "https://ui-avatars.com/api/?name=Tran+B&background=F3F4F6&color=4B5563" },
    ]);

    const [activeContactId, setActiveContactId] = useState(1);

    const [messages, setMessages] = useState([
        { id: 1, senderId: 1, content: "Chào mừng bạn đến với hệ thống hỗ trợ trực tuyến!", timestamp: new Date(Date.now() - 3600000) },
        { id: 2, senderId: "me", content: "Chào Admin, mình cần hỗ trợ về cách tải tài liệu Premium.", timestamp: new Date(Date.now() - 3500000) },
        { id: 3, senderId: 1, content: "Bạn cứ gửi câu hỏi nhé, mình sẽ giải đáp ngay.", timestamp: new Date(Date.now() - 3400000) }
    ]);

    const [input, setInput] = useState("");
    const messageEndRef = useRef(null);

    // Lấy thông tin người đang chat
    const activeContact = contacts.find(c => c.id === activeContactId);

    // Tự động cuộn xuống tin nhắn mới
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeContactId]);

    // Xử lý chuyển người nhắn
    const handleContactClick = (id) => {
        setActiveContactId(id);
        // Cập nhật trạng thái đã đọc
        setContacts(contacts.map(c => c.id === id ? { ...c, unread: 0 } : c));
        // Trong thực tế, bạn sẽ gọi API load tin nhắn của user ID này ở đây
    };

    // Xử lý gửi tin nhắn
    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        const newMsg = {
            id: Date.now(),
            senderId: "me",
            content: input,
            timestamp: new Date()
        };

        setMessages([...messages, newMsg]);
        setInput("");

        // Cập nhật last message cho contact list
        setContacts(contacts.map(c => c.id === activeContactId ? { ...c, lastMessage: input } : c));
    };

    // --- LUMINA DESIGN SYSTEM STYLES ---
    const styles = {
        container: {
            padding: "32px 40px",
            backgroundColor: "#F9FAFB",
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif"
        },
        chatWrapper: {
            display: "flex",
            height: "calc(100vh - 120px)",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            overflow: "hidden"
        },
        sidebar: {
            width: "320px",
            borderRight: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF"
        },
        chatArea: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F9FAFB"
        },
        contactItem: (isActive) => ({
            padding: "16px 20px",
            borderBottom: "1px solid #E5E7EB",
            cursor: "pointer",
            backgroundColor: isActive ? "#EFF6FF" : "#FFFFFF",
            borderLeft: isActive ? "3px solid #1D559F" : "3px solid transparent",
            transition: "all 0.2s"
        }),
        header: {
            padding: "16px 24px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        },
        messageBody: {
            flex: 1,
            padding: "24px",
            overflowY: "auto",
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
            maxWidth: "75%",
            padding: "12px 16px",
            borderRadius: "4px",
            backgroundColor: isMe ? "#1D559F" : "#FFFFFF",
            color: isMe ? "#FFFFFF" : "#111827",
            border: isMe ? "none" : "1px solid #E5E7EB",
            fontSize: "0.875rem",
            lineHeight: "1.5"
        }),
        footer: {
            padding: "16px 24px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #E5E7EB"
        },
        input: {
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            padding: "12px 16px",
            fontSize: "0.875rem",
            boxShadow: "none"
        }
    };

    return (
        <div style={styles.container}>
            <div className="mb-4">
                <h3 style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem', marginBottom: '4px' }}>
                    Hỗ trợ trực tuyến & Tin nhắn
                </h3>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                    Giải đáp thắc mắc và trao đổi trực tiếp với độc giả.
                </p>
            </div>

            <div style={styles.chatWrapper}>
                
                {/* --- CỘT TRÁI: DANH SÁCH LIÊN HỆ --- */}
                <div style={styles.sidebar}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                        <Form.Control 
                            type="text" 
                            placeholder="Tìm kiếm cuộc trò chuyện..." 
                            style={{ ...styles.input, padding: "8px 12px" }}
                        />
                    </div>
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {contacts.map(contact => (
                            <div 
                                key={contact.id} 
                                style={styles.contactItem(activeContactId === contact.id)}
                                onClick={() => handleContactClick(contact.id)}
                                onMouseOver={(e) => { if(activeContactId !== contact.id) e.currentTarget.style.backgroundColor = "#F9FAFB"; }}
                                onMouseOut={(e) => { if(activeContactId !== contact.id) e.currentTarget.style.backgroundColor = "#FFFFFF"; }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ position: 'relative' }}>
                                        <img src={contact.avatar} alt={contact.name} style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1px solid #E5E7EB", objectFit: "cover" }} />
                                        {contact.isOnline && (
                                            <span style={{ position: "absolute", bottom: "2px", right: "2px", width: "10px", height: "10px", backgroundColor: "#10B981", borderRadius: "50%", border: "2px solid #FFF" }}></span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, overflow: "hidden" }}>
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {contact.name}
                                            </span>
                                            {contact.unread > 0 && (
                                                <Badge bg="danger" pill style={{ fontSize: "0.65rem" }}>{contact.unread}</Badge>
                                            )}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: activeContactId === contact.id ? "#1D559F" : "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {contact.lastMessage}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- CỘT PHẢI: KHUNG CHAT --- */}
                <div style={styles.chatArea}>
                    
                    {/* Header Khung Chat */}
                    {activeContact ? (
                        <>
                            <div style={styles.header}>
                                <div className="d-flex align-items-center gap-3">
                                    <img src={activeContact.avatar} alt={activeContact.name} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E5E7EB" }} />
                                    <div>
                                        <h6 style={{ margin: 0, fontWeight: "600", color: "#111827", fontSize: "1rem" }}>{activeContact.name}</h6>
                                        <span style={{ fontSize: "0.75rem", color: activeContact.isOnline ? "#10B981" : "#6B7280", fontWeight: "500" }}>
                                            {activeContact.isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="none" style={{ color: '#4B5563', padding: '4px 8px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </Button>
                            </div>

                            {/* Body Khung Chat */}
                            <div style={styles.messageBody}>
                                <div className="text-center my-2">
                                    <span style={{ fontSize: "0.7rem", color: "#9CA3AF", backgroundColor: "#F3F4F6", padding: "4px 12px", borderRadius: "999px" }}>
                                        Hôm nay
                                    </span>
                                </div>
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === "me";
                                    return (
                                        <div key={msg.id} style={styles.bubbleRow(isMe)}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                                                <div style={styles.bubble(isMe)}>
                                                    {msg.content}
                                                </div>
                                                <span style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "4px", padding: isMe ? "0 4px 0 0" : "0 0 0 4px" }}>
                                                    {moment(msg.timestamp).format("HH:mm")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messageEndRef} />
                            </div>

                            {/* Footer Input */}
                            <div style={styles.footer}>
                                <Form onSubmit={handleSend}>
                                    <InputGroup>
                                        <Button variant="none" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRight: "none", color: "#6B7280", borderRadius: "4px 0 0 4px" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                        </Button>
                                        <Form.Control
                                            placeholder="Nhập tin nhắn..."
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            style={{ ...styles.input, borderLeft: "none", borderRadius: "0" }}
                                        />
                                        <Button 
                                            type="submit" 
                                            style={{ backgroundColor: "#1D559F", color: "#FFFFFF", border: "none", borderRadius: "0 4px 4px 0", padding: "0 24px", fontWeight: "500", fontSize: "0.875rem", transition: "all 0.2s" }}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#154078"; }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#1D559F"; }}
                                            disabled={!input.trim()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center h-100" style={{ color: "#9CA3AF" }}>
                            <div className="text-center">
                                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💬</div>
                                <h5>Chọn một cuộc trò chuyện</h5>
                                <p style={{ fontSize: "0.875rem" }}>Để bắt đầu hỗ trợ người dùng.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessageClient;