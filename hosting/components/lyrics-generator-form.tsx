"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Music } from "lucide-react";

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
import type { GenerateLyricsInput } from "@/ai/flows/generate-lyrics";

const formSchema = z.object({
  theme: z.string().min(3, {
    message: "Theme must be at least 3 characters.",
  }).max(100, {
    message: "Theme must be at most 100 characters.",
  }),
});

type LyricsFormValues = z.infer<typeof formSchema>;

interface LyricsGeneratorFormProps {
  onSubmit: (data: GenerateLyricsInput) => Promise<void>;
  isLoading: boolean;
}

export function LyricsGeneratorForm({ onSubmit, isLoading }: LyricsGeneratorFormProps) {
  const form = useForm<LyricsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "",
    },
  });

  const handleSubmit = (data: LyricsFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lyrics Theme</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer romance, City dreams" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Lyrics"}
          {!isLoading && <Music className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}
