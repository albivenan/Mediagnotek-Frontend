import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediagnoTek - Platform Diagnostik & Knowledge Medis Futuristik',
  description: 'MediagnoTek menyediakan platform cerdas untuk analisis penyakit, pencarian database medis, dan visualisasi data kesehatan interaktif.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
