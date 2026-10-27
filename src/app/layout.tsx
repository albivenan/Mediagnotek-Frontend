import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediagnoTek - Sistem Cerdas Berbasis Kecerdasan Buatan & AI dengan Panduan Klinis untuk Faskes',
  description: 'MediagnoTek adalah sistem cerdas berbasis kecerdasan buatan (AI) dengan panduan klinis terstandarisasi untuk fasilitas kesehatan (faskes).',
  icons: {
    icon: [
      { url: '/logo-mediagnotek.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/logo-mediagnotek.png',
    apple: '/logo-mediagnotek.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-mediagnotek.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-mediagnotek.png" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
