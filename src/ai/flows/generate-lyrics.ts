
'use server';

/**
 * @fileOverview Generates song lyrics based on a user-provided theme.
 *
 * - generateLyrics - A function that handles the lyrics generation process.
 * - GenerateLyricsInput - The input type for the generateLyrics function.
 * - GenerateLyricsOutput - The return type for the generateLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLyricsInputSchema = z.object({
  theme: z.string().describe('The theme for the song lyrics.'),
});
export type GenerateLyricsInput = z.infer<typeof GenerateLyricsInputSchema>;

const GenerateLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The generated song lyrics.'),
});
export type GenerateLyricsOutput = z.infer<typeof GenerateLyricsOutputSchema>;

export async function generateLyrics(input: GenerateLyricsInput): Promise<GenerateLyricsOutput> {
  return generateLyricsFlow(input);
}

const generateLyricsPrompt = ai.definePrompt({
  name: 'generateLyricsPrompt',
  input: {schema: GenerateLyricsInputSchema},
  output: {schema: GenerateLyricsOutputSchema},
  prompt: `You are a songwriter. Write song lyrics based on the following theme:\n\nTheme: {{{theme}}}`,
});

const generateLyricsFlow = ai.defineFlow(
  {
    name: 'generateLyricsFlow',
    inputSchema: GenerateLyricsInputSchema,
    outputSchema: GenerateLyricsOutputSchema,
  },
  async (input: GenerateLyricsInput) => {
    try {
      const {output} = await generateLyricsPrompt(input);
      if (!output || typeof output.lyrics !== 'string' || output.lyrics.trim() === '') {
        console.error('AI model call for lyrics generation succeeded but output was not in the expected format or was empty.');
        throw new Error('The AI model did not return the expected lyrics output. Please try a different theme.');
      }
      return output;
    } catch (e) {
      console.error('Error in generateLyricsFlow:', e); // Log the original error

      let userMessage = 'An unexpected error occurred while generating lyrics. Please try again.';

      if (e instanceof Error && e.message) {
        // Check if it's one of our custom, user-facing errors thrown from the try block
        if (e.message.startsWith('The AI model did not return the expected lyrics output')) {
          userMessage = e.message;
        }
        // Potentially add more checks here for other known error messages from Genkit/GoogleAI
      }
      // Else, if e is not an Error instance or e.message is not specific, we use the generic message.
      
      throw new Error(userMessage); // Throw a new, simple Error object for the client.
    }
  }
);

