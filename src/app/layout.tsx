import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BloomVerse - Poetic Creations',
  description: 'Generate beautiful poems and song lyrics with BloomVerse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <div className="fixed inset-0 -z-10">
          {/* Light theme background */}
          <Image
            className="block dark:hidden"
            src="https://placehold.co/1920x1080.png"
            alt="Light textured background"
            layout="fill"
            objectFit="cover"
            quality={80}
            priority
            data-ai-hint="paper texture"
          />
          {/* Dark theme background */}
          <Image
            className="hidden dark:block"
            src="https://placehold.co/1920x1080.png"
            alt="Dark textured background"
            layout="fill"
            objectFit="cover"
            quality={80}
            priority
            data-ai-hint="dark texture"
          />
          <div className="absolute inset-0 bg-background/40 dark:bg-background/50 backdrop-blur-sm dark:backdrop-blur-md" />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
