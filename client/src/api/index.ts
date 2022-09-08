export const authServerUrl = "http://127.0.01:3000";

export const connectToChatServer = (
  ticket: string,
  onMessage: (message: MessageEvent) => void,
  onClose: (event: CloseEvent) => void
) => {
  console.log("Attempting Connection...");
  const socket = new WebSocket(
    `ws://100.66.142.181:8080/socket?WsTicket=${ticket}`
  );

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    console.log(msg);
    onMessage(msg);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    onClose(event);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
  return socket;
};

export const sendMessage = (socket: WebSocket, msg: string) => {
  console.log("sending msg: ", msg);
  socket.send(msg);
};
