export const messageStyle = {

  mainContainer: {
    display: 'flex',
    height: '100%',
    backgroundColor: '#F9FAFB',
    fontFamily: "'Inter', sans-serif"
  },

  sidebarContainer: {
    width: '20%',
    height: 'calc(100vh - 64px)',
    background: '#fff',
    borderRight: '1px solid #E5E7EB',
    padding: '0',
    display: 'flex',
    flexDirection: 'column'
  },

  sidebarHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#1D559F',
    letterSpacing: '-0.5px'
  },

  sidebarBody: {
    flex: 1,
    overflowY: 'auto'
  },

  chatAreaWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },

  cardStyle: {
    width: "100%",
    height: "calc(100vh - 64px)",
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  headerStyle: {
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
    padding: "16px 24px"
  },

  chatBodyStyle: {
    flex: 1,
    height: "0",
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
    padding: "12px 18px",
    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    backgroundColor: isMe ? "#1D559F" : "#F3F4F6",
    color: isMe ? "#fff" : "#111827",
    border: isMe ? "none" : "1px solid #E5E7EB",
    fontSize: "0.95rem",
    wordBreak: "break-word",
    boxShadow: isMe ? "0 2px 8px rgba(29,85,159,0.08)" : "0 1px 4px rgba(0,0,0,0.03)"
  }),

  senderNameStyle: {
    fontSize: "0.7rem",
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: "4px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },

  footerStyle: {
    backgroundColor: "#FFFFFF",
    borderTop: "1px solid #E5E7EB",
    padding: "16px 24px"
  },

  inputStyle: {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderTopRightRadius: '0px',     // Vuông góc phải trên
    borderBottomRightRadius: '0px',  // Vuông góc phải dưới
    borderRight: 'none',             // Ẩn viền phải để khít nút gửi
    padding: '12px 16px',
    fontSize: '0.875rem',
    boxShadow: 'none',
    fontFamily: 'Inter, sans-serif'
  },

  sendButtonStyle: {
    width: "80px",
    backgroundColor: "#1D559F",
    border: "none",
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
    borderTopRightRadius: '4px',      // Bo góc phải
    borderBottomRightRadius: '4px',
    padding: "0 28px",
    fontWeight: "500",
    fontSize: "0.95rem",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(29,85,159,0.08)",
    transition: "background 0.2s, box-shadow 0.2s",
    cursor: "pointer"
  }
}