"use client";

import { Message } from "@ai-sdk/react";
import { Notes } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";

interface NotesSidebarProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  isDoneSending: boolean;
}

const getNotesFromMessages = async (messages: Message[]) => {
  if (messages.length === 0) {
    return { data: { notes: [], actionableItems: [] } };
  }
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });
  const data: Notes = await response.json();
  return { data };
};

export function NotesSidebar({
  messages,
  isOpen,
  onClose,
  isDoneSending,
}: NotesSidebarProps) {
  const [persistedNotes, setPersistedNotes] = useState<Notes>({
    notes: [],
    actionableItems: [],
  });

  const { data: notesResponse, isLoading } = useQuery({
    queryKey: ["notes", messages],
    queryFn: () => getNotesFromMessages(messages),
    enabled: isDoneSending,
  });

  // Not ideal, but it works for now
  useEffect(() => {
    if (notesResponse?.data) {
      setPersistedNotes(notesResponse.data);
    }
  }, [notesResponse]);

  const notes = persistedNotes;

  return (
    <Sidebar title="Session Notes" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="prose prose-sm">
          <h3>Key Observations</h3>
          <ul>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-4 w-full" />
                </li>
              ))
            ) : notes.notes.length > 0 ? (
              notes.notes.map((note, index) => <li key={index}>{note}</li>)
            ) : (
              <li>
                No key observations available. Start the conversation to get
                insights.
              </li>
            )}
          </ul>
          <h3>Action Items</h3>
          <ul>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-4 w-full" />
                </li>
              ))
            ) : notes.actionableItems.length > 0 ? (
              notes.actionableItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            ) : (
              <li>
                No action items available. Start the conversation to get
                actionable insights.
              </li>
            )}
          </ul>
        </div>
      </div>
    </Sidebar>
  );
}
