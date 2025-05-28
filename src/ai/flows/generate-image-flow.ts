
'use server';
/**
 * @fileOverview Generates an image based on a user-provided prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input: GenerateImageInput) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url || typeof media.url !== 'string' || !media.url.startsWith('data:image')) {
        console.error('Image generation call succeeded but media or media.url was missing or invalid.');
        throw new Error('Image generation failed or did not return an image. Please try a different prompt.');
      }
      return { imageUrl: media.url };
    } catch (e) {
      console.error('Error in generateImageFlow:', e); // Log the original error

      let userMessage = 'An unexpected error occurred while generating the image. Please try again.';

      if (e instanceof Error && e.message) {
        if (e.message.includes('SAFETY') || e.message.toLowerCase().includes('safety policy')) {
             userMessage = 'Image generation was blocked due to safety settings. Please modify your prompt.';
        } else if (e.message.startsWith('Image generation failed or did not return an image')) {
            userMessage = e.message;
        }
        // Consider if other specific messages from the Gemini API need custom handling.
      }
      // Else, if e is not an Error instance or e.message is not specific, we use the generic message.

      throw new Error(userMessage); // Throw a new, simple Error object for the client.
    }
  }
);

