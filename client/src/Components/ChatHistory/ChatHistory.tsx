import Message, { MessageModel } from "../Message";

type ChatHistoryProps = {
  chatHistory: MessageModel[];
};

const ChatHistory = ({ chatHistory }: ChatHistoryProps) => {
  return (
    <div>
      {chatHistory.map((msg, i) => (
        <Message key={i} message={msg} />
      ))}
    </div>
  );
};

export default ChatHistory;
