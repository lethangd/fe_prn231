// src/services/ChatService.js
import * as signalR from "@microsoft/signalr";

const hubUrl = "https://localhost:7097/chathub";

class ChatService {
  constructor() {
    this.connection = null;
  }

  // Initialize connection and set up event listeners
  async startConnection(conversationId, onReceiveMessage) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    // Event listener for receiving messages
    this.connection.on("ReceiveMessage", (message) => {
      if (onReceiveMessage) onReceiveMessage(message);
    });

    // Start the connection
    await this.connection.start();
    console.log("Connected to SignalR");

    // Join the conversation group
    await this.connection.invoke("JoinConversation", conversationId);
  }

  // Send a message to the group
  async sendMessage(conversationId, message) {
    if (this.connection) {
      await this.connection.invoke(
        "SendMessageToGroup",
        conversationId,
        message
      );
    }
  }

  // Stop the SignalR connection and leave the conversation group
  async stopConnection(conversationId) {
    if (this.connection) {
      await this.connection.invoke("LeaveConversation", conversationId);
      await this.connection.stop();
      console.log("Disconnected from SignalR");
    }
  }
}

export default new ChatService();
