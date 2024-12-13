import { openai } from "@ai-sdk/openai";
import { generateObject, Message } from "ai";
import { z } from "zod";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    schemaName: "notes",
    schemaDescription: "A list of notes.",
    schema: z.object({
      notes: z.array(z.string()),
      actionableItems: z.array(z.string()),
    }),
    prompt: `
        You are an ambitious and hardworking assistant to a therapist. 
        You are working closely with the therapist generate notes from the current conversation that the therapist is currently having with the user.

        Here is the current transcript of the conversation:
        
        ${messages
          .map((messages: Message) => messages.role + " " + messages.content)
          .join("\n")}

        Your job is to generate notes and actionable items that the therapist can use to help the user.
        The notes should be detailed and relevant to the conversation.
        As the conversation progresses, the notes should be updated to reflect the current state of the conversation, but should keep good history of the conversation.
        The actionable items should be things that the therapist can do to help the user.
        The actionable items should be most relevant to the more recent messages, but still should contain elements from the older messages.
        `,
  });

  return new Response(
    JSON.stringify({
      notes: result.object.notes,
      actionableItems: result.object.actionableItems,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
