
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Leaf, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import NextImage from "next/image";

interface GeneratedOutputProps {
  title: string;
  content: string | null;
  imageUrl?: string | null;
  isLoading: boolean;
  inputUsed?: { theme?: string; style?: string; prompt?: string };
  isImageGeneration?: boolean;
}

export function GeneratedOutput({ title, content, imageUrl, isLoading, inputUsed, isImageGeneration }: GeneratedOutputProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (content && !imageUrl) {
      setDisplayedContent(content);
      setDisplayedImageUrl(null);
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 500);
      return () => clearTimeout(timer);
    } else if (imageUrl) {
      setDisplayedImageUrl(imageUrl);
      setDisplayedContent("");
      setShowAnimation(true); 
      const timer = setTimeout(() => setShowAnimation(false), 500);
      return () => clearTimeout(timer);
    } else {
      setDisplayedContent("");
      setDisplayedImageUrl(null);
    }
  }, [content, imageUrl]);

  const outputTitle = isImageGeneration && (imageUrl || isLoading) ? (imageUrl ? "Your Generated Image" : "Generating Image...") : title;
  const IconComponent = isImageGeneration && (imageUrl || isLoading) ? ImageIcon : Leaf;


  return (
    <Card className="h-full flex flex-col shadow-xl bg-card/70 backdrop-blur-md border-primary/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl text-primary">
          <IconComponent className="mr-2 h-6 w-6" />
          {outputTitle}
        </CardTitle>
        {inputUsed && (content || imageUrl || isLoading) && (
          <CardDescription className="text-xs pt-1">
            {inputUsed.theme && `Based on theme: "${inputUsed.theme}"`}
            {inputUsed.style && `, style: "${inputUsed.style}"`}
            {inputUsed.prompt && `Based on prompt: "${inputUsed.prompt}"`}
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
        ) : displayedImageUrl ? (
           <div className={cn(
                "relative flex-grow flex items-center justify-center p-4",
                showAnimation && "animate-fade-in-up" 
              )}>
            <NextImage
              src={displayedImageUrl}
              alt={inputUsed?.prompt || "Generated image"}
              width={512} 
              height={512} 
              className="object-contain max-w-full max-h-full rounded-md shadow-md"
              unoptimized={true} 
            />
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
            <IconComponent className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg">Your generated output will appear here.</p>
            <p className="text-sm">Enter your input and click generate!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
