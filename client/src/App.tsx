import React, { useEffect, useState } from "react";
import { connect, sendMsg } from "./api";
import ChatInput from "./Components/ChatInput";
import ChatHistory from "./Components/ChatHistory";
import { MessageModel } from "./Components/Message";

function App() {
  const [chatHistory, setChatHistory] = useState<MessageModel[]>([]);

  const send = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMsg(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  useEffect(() => {
    connect((msg) => {
      console.log("New Message");
      const { body, user } = JSON.parse(msg.data);
      setChatHistory((prev) => [...prev, { body, userName: user.name }]);
    });
  });

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 items-center py-5 box-border">
      <h1 className="text-3xl font-bold underline">Chat App-a you face</h1>
      <ChatHistory chatHistory={chatHistory} />
      {/* <button onClick={() => send()}> Send </button> */}
      <div className="mt-auto w-3/6">
        <ChatInput send={send} />
      </div>
    </div>
  );
}

export default App;
