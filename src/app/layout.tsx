import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { StateProvider } from '../state/Provider';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'PRINTPLATFORM — High-Precision Custom Web-to-Print Manufacturing',
  description:
    'Parameter-driven multi-division Web-to-Print platform with in-browser designer, instant pricing, and automated prepress production.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#F5F4F0] text-[#18181B]">
        <StateProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-zinc-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-zinc-400">Loading...</div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </StateProvider>
      </body>
    </html>
  );
}
