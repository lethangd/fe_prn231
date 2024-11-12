// src/pages/AdminChatPage.js
import React, { useState, useEffect } from "react";
import Chat from "./Chat";

const AdminChatPage = () => {
  const [conversationId, setConversationId] = useState(1);

  useEffect(() => {
    // Có thể fetch conversationId từ API nếu cần
  }, []);

  return (
    <div>
      <h1>Admin Chat</h1>
      <Chat conversationId={conversationId} />
    </div>
  );
};

export default AdminChatPage;
