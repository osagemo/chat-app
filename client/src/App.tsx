import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authServerUrl, connectToChatServer, sendMessage } from "./api";
import ChatInput from "./Components/ChatInput";
import ChatHistory from "./Components/ChatHistory";
import { MessageModel } from "./Components/Message";
import { AuthContext } from "./Components/WithLogin/WithLogin";

function App() {
  const { auth } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState<MessageModel[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);

  // retrieve ticket and connect to chat server
  // current implementation does not allow reconnects
  useEffect(() => {
    fetch(`${authServerUrl}/wsticket`, {
      headers: {
        authorization: `Bearer ${auth.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data?.ticket) {
          socketRef.current = connectToChatServer(
            data.ticket,
            (msg) => {
              console.log("New Message");
              const { body, user } = JSON.parse(msg.data);
              setChatHistory((prev) => [
                ...prev,
                { body, userName: user.name },
              ]);
            },
            (e) => {
              setConnected(false);
            }
          );
          setConnected(true);
        }
      });
    return () => {
      socketRef.current = null;
    };
  }, [auth]);

  if (!connected) {
    return <div>Not connected to chat...</div>;
  }

  const send = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (socketRef.current) {
        sendMessage(socketRef.current, e.currentTarget.value);
      }
      e.currentTarget.value = "";
    }
  };

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
