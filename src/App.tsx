import { lazy, Suspense } from 'react';
import { Reticle } from './components/Reticle';
import { CursorGlow } from './components/CursorGlow';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { WhyHire } from './sections/WhyHire';
import { Contact } from './sections/Contact';

// deferred: not needed for first paint / only on interaction
const DeckBackground = lazy(() =>
  import('./components/DeckBackground').then((m) => ({ default: m.DeckBackground })),
);
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })),
);
const EasterEgg = lazy(() =>
  import('./components/EasterEgg').then((m) => ({ default: m.EasterEgg })),
);
const ResumeModal = lazy(() =>
  import('./components/ResumeModal').then((m) => ({ default: m.ResumeModal })),
);

export function App() {
  useSmoothScroll();

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-fg)]"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <DeckBackground />
      </Suspense>
      <CursorGlow />
      <Reticle />
      <ScrollProgress />
      <Suspense fallback={null}>
        <CommandPalette />
        <EasterEgg />
        <ResumeModal />
      </Suspense>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <WhyHire />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
