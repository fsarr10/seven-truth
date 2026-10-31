import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleSwitcherBanner } from '@/components/layout/RoleSwitcherBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#e8b23a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Seven Truth — Studio d\'enregistrement, Média & Matériel à Thiès (Sénégal)',
  description: 'Label musical et média à Thiès. Studio d\'enregistrement insonorisé, plateau TV & podcast multi-caméras, shooting photo professionnel et location de matériel audiovisuel (Sony FX3, A7IV). Réservation et paiement en ligne par Wave et Orange Money.',
  keywords: [
    'studio d\'enregistrement Thiès',
    'location matériel vidéo Thiès',
    'shooting photo Thiès',
    'podcast Thiès',
    'beatmaking Sénégal',
    'clip vidéo Thiès',
    'mix mastering Dakar Thiès',
    'Seven Truth',
    'Wave Orange Money studio'
  ],
  authors: [{ name: 'Seven Truth Label & Media' }],
  openGraph: {
    title: 'Seven Truth — Label Musical, Studio & Média à Thiès',
    description: 'Enregistrez votre son, tournez votre émission podcast et louez du matériel cinéma au studio Seven Truth à Thiès.',
    url: 'https://seventruth.sn',
    siteName: 'Seven Truth',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Seven Truth Studio Thiès'
      }
    ],
    locale: 'fr_FR',
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
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-zinc-100 antialiased selection:bg-gold selection:text-background">
        <RoleSwitcherBanner />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
