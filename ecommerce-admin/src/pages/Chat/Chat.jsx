// src/components/CustomerChat.js
import { useEffect, useState } from "react";
import ChatService from "./signalRService";

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Đảm bảo luôn có giá trị mặc định
  conversationId = conversationId || 1;

  useEffect(() => {
    // Kiểm tra conversationId tồn tại trước khi kết nối
    if (!conversationId) {
      console.error("ConversationId is required");
      return;
    }

    // Start SignalR connection and set up message listener
    ChatService.startConnection(conversationId.toString(), (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up when component unmounts
    return () => {
      if (conversationId) {
        ChatService.stopConnection(conversationId.toString());
      }
    };
  }, [conversationId]);

  // Handle sending new messages
  const handleSendMessage = async () => {
    if (!conversationId) {
      console.error("ConversationId is required");
      return;
    }

    if (newMessage.trim()) {
      try {
        await ChatService.sendMessage(conversationId.toString(), newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {typeof msg === "object" ? msg.content : msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
