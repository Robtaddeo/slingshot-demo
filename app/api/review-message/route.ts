import { openai } from "@ai-sdk/openai";
import { generateObject, Message } from "ai";
import { z } from "zod";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, message } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    schemaName: "review-message",
    schemaDescription: "A review of the message.",
    schema: z.object({
      review: z.string(),
      score: z.number(),
      suggestions: z.array(z.string()),
    }),
    prompt: `
        You are an expert therapist whose responsibility is to critque junior therapists responses to the user.
        You are working closely with the junior therapist to generate a review of the message that the junior therapist sent to the user.

        Here is the current transcript of the conversation:
        
        ${messages
          .map(
            (m: Message) =>
              `${m.role === "user" ? "User" : "Therapist"}: ${m.content}`
          )
          .join("\n")}

        message to review from the junior therapist: ${message.content}

        Your job is to generate a review of the message that the therapist sent to the user.
        The review should be detailed and relevant to the exchange between the user and the therapise.
        Be stern when reviewing the junior therapist, but also be helpful and provide suggestions for improvement.
        Score the message from 0 to 100, where 0 is the worst and 100 is the best.
        The score should be based on the clarity, relevance, and effectiveness of the message.
        The score should be based on the tone, language, and style of the message.
        The score should be based on the length, complexity, and structure of the message.
        The score should be based on the overall effectiveness of the message in helping the user.
        Provide a list of suggestions for improvement to the message.
        Do not include the score or the suggestions in the review.
        `,
  });

  return new Response(
    JSON.stringify({
      review: result.object.review,
      score: result.object.score,
      suggestions: result.object.suggestions,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
