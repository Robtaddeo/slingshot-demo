interface MessageColor {
  color: string;
  id: string;
  useColor: boolean;
}

interface Notes {
  notes: string[];
  actionableItems: string[];
}

interface MessageReview {
  messageId: string;
  review: string;
  score: number;
  suggestions: string[];
}

export type { MessageColor, Notes, MessageReview };
