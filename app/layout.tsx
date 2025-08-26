import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Genie 3 - AI Virtual World Generator',
  description: 'Genie 3 creates stunning 3D virtual worlds instantly. Our AI transforms text into 3D environments with real-time preview.',
  keywords: 'Genie 3,AI Virtual World Generator,3D Environment Creation,AI 3D Generator',
  icons: {
    icon: '/images/logo.webp',
    shortcut: '/images/logo.webp',
    apple: '/images/logo.webp',
  },
  openGraph: {
    title: 'Genie 3 - AI Virtual World Generator',
    description: 'Genie 3 creates stunning 3D virtual worlds instantly. Our AI transforms text into 3D environments with real-time preview.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/logo.webp',
        width: 32,
        height: 32,
        alt: 'Genie 3 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genie 3 - AI Virtual World Generator',
    description: 'Genie 3 creates stunning 3D virtual worlds instantly. Our AI transforms text into 3D environments with real-time preview.',
    images: ['/images/logo.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-467QL8WZ0C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-467QL8WZ0C');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sqwyvg5tuu");
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingHelpButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}