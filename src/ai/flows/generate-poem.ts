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

const prompt = ai.definePrompt({
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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
