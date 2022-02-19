const socket = new WebSocket("ws://100.124.86.111:8080/socket");

const connect = (onMsgCallback: (msg: MessageEvent) => void) => {
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    console.log(msg);
    onMsgCallback(msg);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

const sendMsg = (msg: string) => {
  console.log("sending msg: ", msg);
  socket.send(msg);
};

export { connect, sendMsg };
