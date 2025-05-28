
// This is an AI-powered code! Please review and test carefully.

'use server';

/**
 * @fileOverview Generates a poem based on a user-provided theme and style.
 *
 * - generatePoem - A function that generates a poem.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The output type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  theme: z.string().describe('The theme of the poem.'),
  style: z.string().describe('The style of the poem (e.g., sonnet, haiku, free verse).'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const poemPrompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: {schema: GeneratePoemInputSchema},
  output: {schema: GeneratePoemOutputSchema},
  prompt: `You are a skilled poet. Generate a poem with the following theme and style:

Theme: {{{theme}}}
Style: {{{style}}}

Poem:`,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async (input: GeneratePoemInput) => {
    try {
      const {output} = await poemPrompt(input);

      if (!output || !output.poem) {
        console.error('AI model call for poem generation succeeded but output was not in the expected format or was empty.');
        throw new Error('The AI model did not return the expected poem output. Please try a different prompt or style.');
      }
      return output;
    } catch (e) {
      const error = e as any;
      console.error('Error in generatePoemFlow:', error);

      let userMessage = 'An unexpected error occurred while generating the poem. Please try again.';
      if (error instanceof Error && error.message) {
        if (error.message.startsWith('The AI model did not return')) {
          userMessage = error.message;
        }
        // For other errors, the generic message is often better for the user,
        // and the full error is logged on the server.
      }
      throw new Error(userMessage);
    }
  }
);
