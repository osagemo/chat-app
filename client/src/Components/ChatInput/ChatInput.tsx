import "./ChatInput.scss";

type ChatInputProps = {
  send: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ChatInput = ({ send }: ChatInputProps) => {
  return (
    <div className="chat-input">
      <input onKeyDown={(e) => send(e)} placeholder="press enter to send" />
    </div>
  );
};

export default ChatInput;
