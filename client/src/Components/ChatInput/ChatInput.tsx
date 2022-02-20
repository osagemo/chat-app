type ChatInputProps = {
  send: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const ChatInput = ({ send }: ChatInputProps) => {
  return (
    <textarea
      className="w-full h-20 p-2 resize-none"
      onKeyDown={(e) => send(e)}
      placeholder="Press enter to send"
    />
  );
};

export default ChatInput;
