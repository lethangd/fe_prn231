// src/components/CustomerChat.js
import { useEffect, useState } from "react";
import ChatService from "./signalRService";

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Start SignalR connection and set up message listener
    ChatService.startConnection(conversationId, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up when component unmounts
    return () => {
      ChatService.stopConnection(conversationId);
    };
  }, [conversationId]);

  // Handle sending new messages
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await ChatService.sendMessage(conversationId, newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
