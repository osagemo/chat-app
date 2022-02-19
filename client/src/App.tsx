import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { connect, sendMsg } from "./api";
import ChatInput from "./Components/ChatInput";
import ChatHistory from "./Components/ChatHistory";
import { MessageModel } from "./Components/Message";

function App() {
  const [chatHistory, setChatHistory] = useState<MessageModel[]>([]);

  const send = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMsg(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  useEffect(() => {
    connect((msg) => {
      console.log("New Message");
      const { body } = JSON.parse(msg.data);
      setChatHistory((prev) => [...prev, { body }]);
    });
  });

  return (
    <div className="App">
      <ChatHistory chatHistory={chatHistory} />
      <ChatInput send={send} />
      {/* <button onClick={() => send()}> Send </button> */}
    </div>
  );
}

export default App;
