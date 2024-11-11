// src/pages/CustomerChatPage.js
import React from "react";
import Chat from "./Chat";

const CustomerChatPage = () => {
  const conversationId = 1; // Replace with dynamic ID from database or context

  return (
    <div>
      <h1>Customer Chat</h1>
      <Chat conversationId={conversationId} />
    </div>
  );
};

export default CustomerChatPage;
