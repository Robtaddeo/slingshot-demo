import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    schemaName: "color",
    schemaDescription: "A hex color code.",
    schema: z.object({
      color: z.string(),
      useColor: z.boolean(),
    }),
    prompt: `
        You are an expert in color psychology. 
        You are working closely with a therapist to determine the color that most closely resonates with the following message: ${message}. 
        If the message is neutral, switch the useColor to false. 
        We only want to display a color if we feel it is necessary to the conversation. Set useColor to true if the message is charged emotionally. Use it sparignly to not dilute the empahsis of the message color when present. 
        but if the message is charged emotionally, it would be nice for the user interacting with the therapis to be subtly changed by the color. 
        Ex. If the message that was originally given to the user is to try and calm them down, you should suggest a calming color. 
        If the user is excited about something , then the color should be more vibrant. 
        DO NOT use colors that futher the mood of the user, as an example, if you are trying to calm the user down, you should not return a red color. 
        You need to be on the ball here or you job is on the line.
        `,
  });

  return new Response(
    JSON.stringify({
      color: result.object.color,
      useColor: result.object.useColor,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
