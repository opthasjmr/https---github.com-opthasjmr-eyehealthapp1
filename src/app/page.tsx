
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, PlusCircle } from "lucide-react"; // Added PlusCircle for the new counter

type GeneratedContentType = {
  title: string;
  text: string | null;
  inputUsed?: { theme: string; style?: string };
};

const themeIdeas = [
  "A journey through a dream",
  "The sound of silence",
  "A city at dawn",
  "Whispers of the ancient forest",
  "The resilience of a wildflower",
  "Echoes from a forgotten past",
  "Stargazing on a lonely night",
  "The dance of the ocean waves",
  "A secret kept by the mountains",
  "The warmth of a shared memory",
  "Shadows in the moonlight",
  "The last leaf of autumn",
  "A river's unending story",
  "Footprints in the desert sand",
  "The magic of a first snowfall"
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentType>({
    title: "Your Bloom",
    text: null,
  });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("poem");
  const [inspiration, setInspiration] = useState<string | null>(null);
  const [count, setCount] = useState(0); // JavaScript state for the counter

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

  const showRandomInspiration = () => {
    // JavaScript logic to pick a random theme
    const randomIndex = Math.floor(Math.random() * themeIdeas.length);
    setInspiration(themeIdeas[randomIndex]);
  };

  // JavaScript function to increment the counter
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
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

        {/* Spark of Inspiration Feature */}
        <div className="space-y-3 pt-2">
          <Button onClick={showRandomInspiration} variant="outline" className="w-full">
            <Sparkles className="mr-2 h-4 w-4 text-accent" /> Spark of Inspiration
          </Button>
          {inspiration && (
            <Card className="p-3 bg-accent/10 border-accent/30 shadow-sm">
              <p className="text-sm text-center text-accent-foreground/90 font-medium">{inspiration}</p>
            </Card>
          )}
        </div>

        {/* Simple JavaScript Counter Feature */}
        <div className="space-y-3 pt-4">
          <Separator />
          <h3 className="text-lg font-medium pt-2 text-center">Simple Counter</h3>
          <Card className="p-4 bg-secondary/20 border-secondary/40 shadow-sm">
            <p className="text-center text-2xl font-semibold text-secondary-foreground mb-3">{count}</p>
            <Button onClick={incrementCount} variant="secondary" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Increment Count
            </Button>
          </Card>
        </div>


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

