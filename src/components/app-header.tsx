import { Feather } from 'lucide-react';

export function AppHeader() {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <Feather className="h-10 w-10 text-primary" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">BloomVerse</h1>
        <p className="text-sm text-muted-foreground">Craft your poetic and lyrical masterpieces.</p>
      </div>
    </div>
  );
}
