"use client";

import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Message } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";

const reviewMessage = async (messages: Message[], message: Message) => {
  const response = await fetch("/api/review-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, message }),
  });
  const data = await response.json();
  return { data };
};

interface ReviewSidebarProps {
  isOpen: boolean;
  messages: Message[];
  message: Message;
  onClose: () => void;
}

const ReviewSidebar = ({
  message,
  messages,
  isOpen,
  onClose,
}: ReviewSidebarProps) => {
  const { data: review, isLoading } = useQuery({
    queryKey: ["review", message.id],
    queryFn: () => reviewMessage(messages, message),
  });

  const [showFullMessage, setShowFullMessage] = useState(false);
  const maxMessageLength = 200;

  const toggleMessageView = () => {
    setShowFullMessage(!showFullMessage);
  };

  const clippedMessage =
    message.content.length > maxMessageLength && !showFullMessage
      ? `${message.content.substring(0, maxMessageLength)}...`
      : message.content;

  return (
    <Sidebar title="Review" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 prose prose-sm">
        <h3 className="my-2">Message</h3>
        <div className="bg-foreground/5 p-4 rounded-md">
          <div className="markdown">
            <ReactMarkdown>{clippedMessage}</ReactMarkdown>
            {message.content.length > maxMessageLength && (
              <Button
                className="p-0"
                variant="link"
                size="sm"
                onClick={toggleMessageView}
              >
                {showFullMessage ? "Read less" : "Read more"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <h3 className="my-0">Score</h3>
          {isLoading ? (
            <Skeleton className="h-4 w-8" />
          ) : (
            <p className="my-0">{review?.data?.score}</p>
          )}
        </div>

        <h3>Response Review</h3>
        <div className="markdown">
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <ReactMarkdown>{review?.data?.review}</ReactMarkdown>
          )}
        </div>

        <h3>Suggestions</h3>
        {isLoading ? (
          <ul>
            {[...Array(3)].map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {review?.data?.suggestions.map(
              (suggestion: string, index: number) => (
                <li key={index}>
                  <ReactMarkdown>{suggestion}</ReactMarkdown>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </Sidebar>
  );
};

export default ReviewSidebar;
