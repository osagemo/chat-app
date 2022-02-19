import { MessageModel } from ".";
import "./Message.scss";
type MessageProps = {
  message: MessageModel;
};

const Message = ({ message }: MessageProps) => {
  return <div className="message">{message.body}</div>;
};

export default Message;
