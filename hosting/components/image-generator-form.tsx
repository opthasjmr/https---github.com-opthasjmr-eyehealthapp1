
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { GenerateImageInput } from "@/ai/flows/generate-image-flow";

const formSchema = z.object({
  prompt: z.string().min(3, {
    message: "Prompt must be at least 3 characters.",
  }).max(200, { 
    message: "Prompt must be at most 200 characters.",
  }),
});

type ImageFormValues = z.infer<typeof formSchema>;

interface ImageGeneratorFormProps {
  onSubmit: (data: GenerateImageInput) => Promise<void>;
  isLoading: boolean;
}

export function ImageGeneratorForm({ onSubmit, isLoading }: ImageGeneratorFormProps) {
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleSubmit = (data: ImageFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Prompt</FormLabel>
              <FormControl>
                <Input placeholder="e.g., A majestic dragon flying over mountains" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Image"}
          {!isLoading && <ImageIcon className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}
