import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Notebook } from "lucide-react";
import { useTherapist } from "@/contexts/therapist-context";

interface MessageInputProps {
  input: string;
  toggleNotes: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  toggleNotes,
  handleInputChange,
  handleSubmit,
}) => {
  const { therapistMode } = useTherapist();

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
    >
      <div className="flex flex-col items-center justify-center bg-secondary rounded-lg p-3">
        <div className="w-full flex gap-2">
          <Input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-transparent focus-visible:ring-0 shadow-none border-none"
          />
          <Button type="submit" className="shadow-sm rounded-full" size="icon">
            <ArrowUp />
          </Button>
        </div>
        {therapistMode && (
          <div className="text-sm text-muted-foreground mt-2 text-left w-full px-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-background"
              onClick={toggleNotes}
            >
              <Notebook />
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageInput;
