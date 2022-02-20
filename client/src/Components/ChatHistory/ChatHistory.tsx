import Message, { MessageModel } from "../Message";

type ChatHistoryProps = {
  chatHistory: MessageModel[];
};

const ChatHistory = ({ chatHistory }: ChatHistoryProps) => {
  return (
    <div className="w-1/2 overflow-y-auto py-2">
      {chatHistory.map((msg, i) => (
        <Message key={i} message={msg} />
      ))}
    </div>
  );
};

export default ChatHistory;
