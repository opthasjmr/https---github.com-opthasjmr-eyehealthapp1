
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

      if (!output || typeof output.poem !== 'string' || output.poem.trim() === '') {
        console.error('AI model call for poem generation succeeded but output was not in the expected format or was empty.');
        throw new Error('The AI model did not return the expected poem output. Please try a different prompt or style.');
      }
      return output;
    } catch (e) {
      console.error('Error in generatePoemFlow:', e); // Log the original error

      let userMessage = 'An unexpected error occurred while generating the poem. Please try again.';

      if (e instanceof Error && e.message) {
        // Check if it's one of our custom, user-facing errors thrown from the try block
        if (e.message.startsWith('The AI model did not return the expected poem output')) {
          userMessage = e.message;
        }
        // Potentially add more checks here for other known error messages from Genkit/GoogleAI
      }
      // Else, if e is not an Error instance or e.message is not specific, we use the generic message.

      throw new Error(userMessage); // Throw a new, simple Error object for the client.
    }
  }
);

