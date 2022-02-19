type ChatInputProps = {
  send: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ChatInput = ({ send }: ChatInputProps) => {
  return (
    <div className="">
      <input onKeyDown={(e) => send(e)} placeholder="press enter to send" />
    </div>
  );
};

export default ChatInput;
