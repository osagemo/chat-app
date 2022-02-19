import { MessageModel } from ".";

type MessageProps = {
  message: MessageModel;
};

const Message = ({ message }: MessageProps) => {
  return <div className="">{message.body}</div>;
};

export default Message;
