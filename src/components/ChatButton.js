import React from "react";
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { chatButtonStyle } from "../style/ChatButtonStyle";

const ChatButton = () => {
	const [hover, setHover] = React.useState(false);
    const nav = useNavigate();
	return (
		<button
			style={hover ? { ...chatButtonStyle.buttonStyle, ...chatButtonStyle.buttonHoverStyle } : chatButtonStyle.buttonStyle}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => nav("/message-client")}
			aria-label="Mở chat hỗ trợ"
		>
			<IoChatbubbleEllipsesOutline />
		</button>
	);
}

export default ChatButton;
