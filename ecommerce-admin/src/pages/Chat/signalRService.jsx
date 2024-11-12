// src/services/ChatService.js
import * as signalR from "@microsoft/signalr";

const hubUrl = "https://localhost:7097/chathub";

class ChatService {
  constructor() {
    this.connection = null;
  }

  async startConnection(conversationId, onReceiveMessage) {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      this.connection.on("ReceiveMessage", (message) => {
        if (onReceiveMessage) onReceiveMessage(message);
      });

      await this.connection.start();
      console.log("Connected to SignalR");

      const conversationIdString = conversationId.toString();
      await this.connection.invoke("JoinConversation", conversationIdString);
    } catch (error) {
      console.error("SignalR connection error:", error);
      throw error;
    }
  }

  async sendMessage(conversationId, message) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        const conversationIdString = conversationId.toString();
        await this.connection.invoke(
          "SendMessageToGroup",
          conversationIdString,
          message
        );
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    } else {
      console.error("No connection to server!");
    }
  }

  async stopConnection(conversationId) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        const conversationIdString = conversationId.toString();
        await this.connection.invoke("LeaveConversation", conversationIdString);
        await this.connection.stop();
        console.log("Disconnected from SignalR");
      } catch (error) {
        console.error("Error stopping connection:", error);
      }
    }
  }
}

export default new ChatService();
