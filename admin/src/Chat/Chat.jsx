import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import ChatRoomsAPI from "../API/ChatRoomsAPI";
import "./Chat.css";

function Chat(props) {
  const [allRoom, setAllRoom] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [connection, setConnection] = useState(null);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      const result = await ChatRoomsAPI.getAllRoom();
      setAllRoom(result);
    };

    fetchRooms();
  }, []);

  // Set up SignalR connection
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub")
      .build();

    setConnection(newConnection);
  }, []);

  // Connect to the room and set up message receiving
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR!");
          if (roomId) {
            connection.invoke("JoinRoom", roomId).then(() => {
              console.log(`Joined room: ${roomId}`);
            });
          }

          connection.on("ReceiveMessage", (message, isAdmin) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { message, isAdmin },
            ]);
          });
        })
        .catch((err) => console.error("Error connecting to SignalR:", err));
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection, roomId]);

  const handleRoomChange = (roomId) => {
    setRoomId(roomId);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (!roomId || !textMessage) return;

    const messageData = {
      roomId,
      message: textMessage,
      isAdmin: true, // Assuming admin sends messages
    };

    connection
      .invoke("SendMessage", roomId, textMessage, true)
      .then(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: textMessage, isAdmin: true },
        ]);
        setTextMessage("");
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-sidebar">
        <input
          type="text"
          placeholder="Search Contact"
          className="form-control"
        />
        <div className="rooms-list">
          {allRoom.map((room) => (
            <div
              key={room.id}
              className="room"
              onClick={() => handleRoomChange(room.id)}
            >
              <p>{room.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.isAdmin ? "chat-message admin" : "chat-message user"
              }
            >
              {msg.isAdmin ? "You: " : "Client: "} {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
