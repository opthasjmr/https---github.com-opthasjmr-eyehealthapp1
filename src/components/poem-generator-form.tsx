"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Flower2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { POEM_STYLES } from "@/lib/constants";
import type { GeneratePoemInput } from "@/ai/flows/generate-poem";

const formSchema = z.object({
  theme: z.string().min(3, {
    message: "Theme must be at least 3 characters.",
  }).max(100, {
    message: "Theme must be at most 100 characters.",
  }),
  style: z.string().min(1, { message: "Please select a poem style." }),
});

type PoemFormValues = z.infer<typeof formSchema>;

interface PoemGeneratorFormProps {
  onSubmit: (data: GeneratePoemInput) => Promise<void>;
  isLoading: boolean;
  currentPoem?: string;
}

export function PoemGeneratorForm({ onSubmit, isLoading, currentPoem }: PoemGeneratorFormProps) {
  const form = useForm<PoemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "",
      style: "",
    },
  });

  const handleSubmit = (data: PoemFormValues) => {
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
              <FormLabel>Poem Theme</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spring awakening, Lost love" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poem Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {POEM_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Poem"}
          {!isLoading && <Flower2 className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}
