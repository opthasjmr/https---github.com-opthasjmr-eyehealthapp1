
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

      if (!media?.url) {
        console.error('Image generation call succeeded but media or media.url was missing.');
        throw new Error('Image generation failed or did not return an image. Please try a different prompt.');
      }
      return { imageUrl: media.url };
    } catch (e) {
      const error = e as any;
      console.error('Error in generateImageFlow:', error);

      let userMessage = 'An unexpected error occurred while generating the image. Please try again.';
      if (error instanceof Error && error.message) {
        if (error.message.includes('SAFETY')) {
             userMessage = 'Image generation was blocked due to safety settings. Please modify your prompt.';
        } else if (error.message.startsWith('Image generation failed')) {
            userMessage = error.message;
        }
      }
      throw new Error(userMessage);
    }
  }
);
