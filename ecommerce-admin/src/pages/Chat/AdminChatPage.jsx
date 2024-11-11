// src/pages/AdminChatPage.js
import Chat from "./Chat";

const AdminChatPage = () => {
  const conversationId = 1;

  return (
    <div>
      <h1>Admin Chat</h1>
      <Chat conversationId={conversationId} />
    </div>
  );
};

export default AdminChatPage;
