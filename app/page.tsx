import { Converter } from '@/components/converter';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Github, Youtube } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <Youtube className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold">YT Converter</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://github.com/yourusername/youtube-converter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <ModeToggle />
          </div>
        </nav>

        <section className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Convert YouTube Videos to <span className="text-primary">MP3</span>{' '}
            or <span className="text-primary">MP4</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Fast, free, and easy to use. No registration required.
          </p>
        </section>

        <Converter />

        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} YT Converter. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
