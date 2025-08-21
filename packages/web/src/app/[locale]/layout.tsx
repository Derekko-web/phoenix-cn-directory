import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Phoenix Chinese Directory | 凤凰城华人目录',
  description: 'Discover Chinese businesses, services, and events in the Phoenix metro area. Your comprehensive guide to the Chinese community in Phoenix.',
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {/* Skip Links */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-chinese-red-600 text-white px-4 py-2 rounded z-50"
            >
              Skip to main content
            </a>
            <Navigation />
            <main id="main-content" className="pt-20">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}