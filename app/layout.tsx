import type { Metadata } from 'next';
import { Archivo_Black, Work_Sans, Space_Mono } from 'next/font/google';
import './globals.css';

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MONITORING SITE // REAL-TIME SYNTHETIC UPTIME & API RELIABILITY PLATFORM',
  description: 'High-performance website and API synthetic monitoring platform. Real-time network latency waterfall, 90-day SLA reliability history, SSL certificate intelligence, and global multi-node consensus probing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${workSans.variable} ${spaceMono.variable}`}
    >
      <body className="font-work bg-white text-black min-h-screen antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
