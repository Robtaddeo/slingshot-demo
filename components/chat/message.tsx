import { MessageColor } from "@/types/chat";
import { Message } from "@ai-sdk/react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useTherapist } from "@/contexts/therapist-context";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageProps {
  message: Message;
  color: MessageColor;
  onReviewClick: (message: Message) => void;
}

const MessageBubble: React.FC<MessageProps> = ({
  message,
  color,
  onReviewClick,
}) => {
  const { therapistMode } = useTherapist();

  return (
    <motion.div
      initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{
          scale: 1,
          borderColor: color.useColor ? color.color : undefined,
          borderWidth: color.useColor ? "1px" : "0px",
        }}
        className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
          message.role === "user"
            ? `bg-primary text-primary-foreground rounded-br-none border`
            : `bg-secondary text-secondary-foreground rounded-bl-none prose prose-sm max-w-none`
        }`}
      >
        <div className="overflow-x-auto whitespace-pre-wrap markdown text-sm">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {therapistMode && message.role === "assistant" && (
          <div className="flex justify-end">
            <Button
              onClick={() => onReviewClick(message)}
              className="mt-2 text-xs"
              aria-label="View Review"
              size="icon"
              variant="ghost"
            >
              <Eye />
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MessageBubble;
