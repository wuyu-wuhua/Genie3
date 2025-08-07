import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingHelpButton from '@/components/FloatingHelpButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
      title: 'Genie 3 - AI Virtual World Generator',
    description: 'Genie 3 creates stunning 3D virtual worlds instantly. Our AI transforms text into 3D environments with real-time preview.',
    keywords: 'Genie 3,AI Virtual World Generator,3D Environment Creation,AI 3D Generator',
      openGraph: {
      title: 'Genie 3 - AI Virtual World Generator',
      description: 'Genie 3 creates stunning 3D virtual worlds instantly. Our AI transforms text into 3D environments with real-time preview.',
    type: 'website',
    locale: 'en_US',
  },
      twitter: {
      card: 'summary_large_image',
      title: 'Genie 3 - AI Virtual World Generator',
      description: 'Genie 3 creates stunning 3D virtual worlds instantly. Our AI transforms text into 3D environments with real-time preview.',
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
        <meta name="google-site-verification" content="6rlsroVDAOoG12NMDi8NB9HOW97t9p6cKp9VaFeAGps" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-467QL8WZ0C"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-467QL8WZ0C');
            `,
          }}
        />
        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "sqwyvg5tuu");
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingHelpButton />
      </body>
    </html>
  );
}