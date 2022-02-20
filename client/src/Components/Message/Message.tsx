import { MessageModel } from ".";

type MessageProps = {
  message: MessageModel;
};

const Message = ({ message }: MessageProps) => {
  return (
    <div className="">
      <b>{message.userName}: </b>
      {message.body}
    </div>
  );
};

export default Message;
