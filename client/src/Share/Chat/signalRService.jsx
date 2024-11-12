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

    try {
      // Start the connection
      await this.connection.start();
      console.log("Connected to SignalR");

      // Convert conversationId to string if it's a number
      const conversationIdString = conversationId.toString();

      // Join the conversation group
      await this.connection.invoke("JoinConversation", conversationIdString);
    } catch (error) {
      console.error("SignalR connection error:", error);
    }
  }

  // Send a message to the group
  async sendMessage(conversationId, message) {
    if (this.connection) {
      try {
        // Convert conversationId to string if it's a number
        const conversationIdString = conversationId.toString();

        await this.connection.invoke(
          "SendMessageToGroup",
          conversationIdString,
          message
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }

  // Stop the SignalR connection and leave the conversation group
  async stopConnection(conversationId) {
    if (this.connection) {
      try {
        await this.connection.invoke("LeaveConversation", conversationId);
        await this.connection.stop();
        console.log("Disconnected from SignalR");
      } catch (error) {
        console.error("Error stopping SignalR connection:", error);
      }
    }
  }
}

export default new ChatService();
