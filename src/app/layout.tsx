import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/passa/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600']
});

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['800']
});

export const metadata: Metadata = {
  title: 'Passa – No-fuss African tickets on-chain',
  description:
    'The first African-built, blockchain-powered event platform that lets fans discover and buy real tickets, artists get paid instantly, and creators & brands prove their impact—all without fraud or middlemen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased', inter.variable, manrope.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
