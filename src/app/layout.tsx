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
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Floral background"
            layout="fill"
            objectFit="cover"
            quality={80}
            priority
            data-ai-hint="delicate floral pattern"
          />
          <div className="absolute inset-0 bg-background/50 backdrop-blur-xs" />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
