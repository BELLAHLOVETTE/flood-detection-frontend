// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flood-Watch Cameroon — Système d\'alerte précoce',
  description:
    'Système de détection des inondations et d\'alerte précoce pour la région de Maga, Extrême-Nord Cameroun.',
  keywords: 'inondation, Maga, Cameroun, alerte, satellite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}