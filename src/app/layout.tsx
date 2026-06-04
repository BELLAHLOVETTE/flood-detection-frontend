// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Flood-Watch Cameroun',
  description: 'Système de détection des inondations et d\'alerte précoce — Maga, Extrême-Nord',
  keywords: 'inondation, Maga, Cameroun, alerte, satellite, Sentinel-1',
  authors: [{ name: 'Flood-Watch System' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}