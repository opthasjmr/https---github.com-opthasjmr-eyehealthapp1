"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";
import React, { useEffect, useState } from "react";

interface GeneratedOutputProps {
  title: string;
  content: string | null;
  isLoading: boolean;
  inputUsed?: { theme: string; style?: string };
}

export function GeneratedOutput({ title, content, isLoading, inputUsed }: GeneratedOutputProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (content) {
      setDisplayedContent(content);
      setShowAnimation(true);
      // Reset animation trigger after it runs
      const timer = setTimeout(() => setShowAnimation(false), 500); // Match animation duration
      return () => clearTimeout(timer);
    } else {
      setDisplayedContent("");
    }
  }, [content]);

  return (
    <Card className="h-full flex flex-col shadow-xl bg-card/70 backdrop-blur-md border-primary/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl text-primary">
          <Leaf className="mr-2 h-6 w-6" />
          {title}
        </CardTitle>
        {inputUsed && (content || isLoading) && (
          <CardDescription className="text-xs pt-1">
            Based on theme: "{inputUsed.theme}"
            {inputUsed.style && `, style: "${inputUsed.style}"`}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center space-y-2 text-muted-foreground">
            <Spinner className="h-8 w-8 text-primary" />
            <p>Crafting your masterpiece...</p>
            <p className="text-xs">This may take a moment.</p>
          </div>
        ) : displayedContent ? (
          <ScrollArea className="flex-grow h-[calc(100vh-250px)] md:h-auto">
            <pre
              className={cn(
                "whitespace-pre-wrap break-words font-sans text-sm leading-relaxed p-1",
                showAnimation && "animate-fade-in-up"
              )}
            >
              {displayedContent}
            </pre>
          </ScrollArea>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <Leaf className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg">Your generated text will appear here.</p>
            <p className="text-sm">Enter a theme and style, then click generate!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
