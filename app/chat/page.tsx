"use client";

import { useState } from "react";
import { Message, useChat } from "ai/react";
import Chat from "@/components/chat/chat";
import Navbar from "@/components/layout/navbar";
import MessageInput from "@/components/chat/message-input";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { MessageColor } from "@/types/chat";
import { NotesSidebar } from "@/components/notes/notes-sidebar";
import { useTherapist } from "@/contexts/therapist-context";
import ReviewSidebar from "@/components/reviews/review-sidebar";

const playfair = Playfair_Display({ subsets: ["latin"] });

const getColorFromMessage = async (message: string) => {
  const response = await fetch("/api/message-color", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  return { data };
};

export default function ChatPage() {
  const { therapistMode } = useTherapist();
  const [colors, setColors] = useState<MessageColor[]>([]);
  const [isDoneSending, setIsDoneSending] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const wrapHandleSubmit = (
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  ) => {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      setIsDoneSending(false);
      handleSubmit(e);
    };
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async (message) => {
      setIsDoneSending(true);
      const color = await getColorFromMessage(message.content);
      setColors((prevColors) => [
        ...prevColors,
        {
          id: message.id,
          color: color.data.color,
          useColor: color.data.useColor,
        },
      ]);
    },
  });

  const handleSetShowNotes = () => {
    setShowNotes((prev) => !prev);
    setShowReview(false);
  };

  const handleReviewClick = (message: Message) => {
    setSelectedMessage(message);
    setShowReview(true);
    setShowNotes(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-h-screen w-full">
      <Navbar />
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full flex-grow flex-1">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6 }}
            className={`text-2xl font-bold lg:max-w-2xl ${playfair.className} -mt-16`}
          >
            What&apos;s on your mind?
          </motion.h2>
          <MessageInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            toggleNotes={handleSetShowNotes}
          />
        </div>
      ) : (
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={wrapHandleSubmit(handleSubmit)}
          colors={colors}
          toggleNotes={handleSetShowNotes}
          onReviewClick={handleReviewClick}
        />
      )}

      {therapistMode && showNotes && (
        <NotesSidebar
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          messages={messages}
          isDoneSending={isDoneSending}
        />
      )}
      {therapistMode && showReview && selectedMessage && (
        <ReviewSidebar
          isOpen={showReview}
          message={selectedMessage}
          messages={messages.slice(
            0,
            messages.findIndex((m) => m.id === selectedMessage.id)
          )}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}
