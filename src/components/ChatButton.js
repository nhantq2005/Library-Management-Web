import React from "react";
import { useNavigate } from "react-router-dom";
import { buttonStyle, buttonHoverStyle } from '../style/ChatButtonStyle';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

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
			<IoChatbubbleEllipsesOutline />
		</button>
	);
}

export default ChatButton;
