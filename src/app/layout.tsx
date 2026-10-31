import type { Metadata, Viewport } from 'next';
import { Anton, Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { PaperTexture } from '@/components/layout/PaperTexture';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#d7261e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Seven Truth — Studio, Podcast & Shooting à Thiès',
  description:
    'Label indépendant à Thiès, Sénégal : studio son insonorisé, plateau TV & podcast multi-caméras 4K, salle shooting photo et location de matériel audiovisuel.',
  keywords: [
    'studio d\'enregistrement Thiès',
    'location matériel vidéo Thiès',
    'shooting photo Thiès',
    'podcast Thiès',
    'beatmaking Sénégal',
    'Seven Truth',
    'studio son Sénégal'
  ],
  authors: [{ name: 'Seven Truth Studio & Records' }],
  openGraph: {
    title: 'Seven Truth — Studio, Podcast & Shooting à Thiès',
    description:
      'Un studio son, un plateau TV & podcast et une salle shooting sous le même toit à Thiès. Réservez votre séance avec acompte Wave ou Orange Money.',
    url: 'https://seven-truth.vercel.app',
    siteName: 'Seven Truth',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Seven Truth Studio Thiès',
      },
    ],
    locale: 'fr_SN',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}
    >
      <body className="min-h-screen bg-[#f1eadd] text-[#121110] antialiased selection:bg-[#d7261e] selection:text-[#f1eadd]">
        <PaperTexture />
        <main>{children}</main>
      </body>
    </html>
  );
}
