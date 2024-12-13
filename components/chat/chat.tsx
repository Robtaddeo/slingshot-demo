import { Message } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "@/components/chat/message";
import MessageInput from "@/components/chat/message-input";
import { Source_Sans_3 } from "next/font/google";
import { MessageColor } from "@/types/chat";
import { useTherapist } from "@/contexts/therapist-context";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

interface ChatProps {
  input: string;
  messages: Message[];
  colors: MessageColor[];
  toggleNotes: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReviewClick: (message: Message) => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  input,
  colors,
  handleInputChange,
  handleSubmit,
  toggleNotes,
  onReviewClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { therapistMode } = useTherapist();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, input]);

  return (
    <div
      className={`flex flex-col w-full max-w-2xl mx-auto flex-1 relative h-full ${sourceSans.className}`}
    >
      <div
        className={`flex flex-col w-full max-w-2xl mx-auto relative ${
          therapistMode ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-10rem)]"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 message-container">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                color={
                  colors.find((color) => color.id === message.id) || {
                    color: "",
                    id: "",
                    useColor: false,
                  }
                }
                onReviewClick={onReviewClick}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <MessageInput
          toggleNotes={toggleNotes}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Chat;
