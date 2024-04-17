import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

import { ThemeProvider } from '@/src/components/widthThemeProvider';
import BaseLayout from '@/src/layouts/Base'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '阿呆是一只猫🐱',
  description: '阿呆是一只猫，一只懒惰的猫🐱',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BaseLayout>
            {children}
          </BaseLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
