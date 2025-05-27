"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoemGeneratorForm } from "@/components/poem-generator-form";
import { LyricsGeneratorForm } from "@/components/lyrics-generator-form";
import { GeneratedOutput } from "@/components/generated-output";
import { AppHeader } from "@/components/app-header";
import { useToast } from "@/hooks/use-toast";
import { generatePoem, type GeneratePoemInput } from "@/ai/flows/generate-poem";
import { generateLyrics, type GenerateLyricsInput } from "@/ai/flows/generate-lyrics";
import { Separator } from "@/components/ui/separator";

type GeneratedContentType = {
  title: string;
  text: string | null;
  inputUsed?: { theme: string; style?: string };
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentType>({
    title: "Your Bloom",
    text: null,
  });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("poem");

  const handlePoemSubmit = async (data: GeneratePoemInput) => {
    setIsLoading(true);
    setGeneratedContent({ title: "Your Poetic Bloom", text: null, inputUsed: data });
    try {
      const result = await generatePoem(data);
      setGeneratedContent({ title: "Your Poetic Bloom", text: result.poem, inputUsed: data });
    } catch (error) {
      console.error("Failed to generate poem:", error);
      toast({
        title: "Error",
        description: "Failed to generate poem. Please try again.",
        variant: "destructive",
      });
      setGeneratedContent({ title: "Your Poetic Bloom", text: "Could not generate poem. Please try again.", inputUsed: data });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLyricsSubmit = async (data: GenerateLyricsInput) => {
    setIsLoading(true);
    setGeneratedContent({ title: "Your Lyrical Tune", text: null, inputUsed: data });
    try {
      const result = await generateLyrics(data);
      setGeneratedContent({ title: "Your Lyrical Tune", text: result.lyrics, inputUsed: data });
    } catch (error) {
      console.error("Failed to generate lyrics:", error);
      toast({
        title: "Error",
        description: "Failed to generate lyrics. Please try again.",
        variant: "destructive",
      });
      setGeneratedContent({ title: "Your Lyrical Tune", text: "Could not generate lyrics. Please try again.", inputUsed: data });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-transparent antialiased">
      {/* Left Panel */}
      <section className="w-full md:w-[450px] md:max-w-[40%] p-6 md:p-8 space-y-6 bg-card/90 backdrop-blur-sm md:border-r border-border/50 md:overflow-y-auto shadow-lg md:shadow-none">
        <AppHeader />
        <Tabs defaultValue="poem" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="poem">Poem Generator</TabsTrigger>
            <TabsTrigger value="lyrics">Lyrics Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="poem">
            <PoemGeneratorForm
              onSubmit={handlePoemSubmit}
              isLoading={isLoading && activeTab === 'poem'}
            />
          </TabsContent>
          <TabsContent value="lyrics">
            <LyricsGeneratorForm
              onSubmit={handleLyricsSubmit}
              isLoading={isLoading && activeTab === 'lyrics'}
            />
          </TabsContent>
        </Tabs>
         <Separator className="my-6" />
        <div className="text-xs text-muted-foreground space-y-2">
          <p><strong>Tip:</strong> Be specific with your themes for more tailored results!</p>
          <p>Experiment with different poem styles to discover unique creations.</p>
        </div>
      </section>

      {/* Right Panel */}
      <section className="w-full md:flex-1 p-6 md:p-8 md:overflow-y-auto">
        <GeneratedOutput
          title={generatedContent.title}
          content={generatedContent.text}
          isLoading={isLoading}
          inputUsed={generatedContent.inputUsed}
        />
      </section>
    </main>
  );
}
