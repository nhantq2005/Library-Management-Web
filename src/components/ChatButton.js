import React from "react";
import { useNavigate } from "react-router-dom";

const buttonStyle = {
	position: "fixed",
	right: "32px",
	bottom: "32px",
	background: "#1a365d",
	color: "#fff",
	border: "none",
	borderRadius: "50%",
	width: "60px",
	height: "60px",
	boxShadow: "0 4px 16px rgba(26, 54, 93, 0.18)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "2rem",
	cursor: "pointer",
	zIndex: 2000,
	transition: "background 0.2s, box-shadow 0.2s"
};

const buttonHoverStyle = {
	background: "#274472",
	boxShadow: "0 6px 24px rgba(26, 54, 93, 0.22)"
};

const ChatButton = () => {
	const [hover, setHover] = React.useState(false);
    const nav = useNavigate();
	return (
		<button
			style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => nav("/message-client")}
			aria-label="Mở chat hỗ trợ"
		>
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M21 12c0 4.418-4.03 8-9 8-.98 0-1.92-.12-2.8-.34L3 20l1.13-3.38C3.41 15.1 3 13.59 3 12c0-4.42 4.03-8 9-8s9 3.58 9 8z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="#1a365d"/>
				<circle cx="8.5" cy="12" r="1.5" fill="#fff"/>
				<circle cx="12" cy="12" r="1.5" fill="#fff"/>
				<circle cx="15.5" cy="12" r="1.5" fill="#fff"/>
			</svg>
		</button>
	);
}

export default ChatButton;
