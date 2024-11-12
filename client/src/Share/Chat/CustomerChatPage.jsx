// src/pages/CustomerChatPage.js
import React, { useState, useEffect } from "react";
import Chat from "./Chat";

const CustomerChatPage = () => {
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    // Giả sử bạn lấy conversationId từ API hoặc context
    // Trong trường hợp này tôi hardcode là 1
    setConversationId(1);
  }, []);

  if (!conversationId) {
    return <div>Loading conversation...</div>;
  }

  return (
    <div>
      <h1>Customer Chat</h1>
      <Chat conversationId={conversationId} />
    </div>
  );
};

export default CustomerChatPage;
