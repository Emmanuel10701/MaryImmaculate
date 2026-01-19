import localFont from "next/font/local";
import "./globals.css";
import ClientLayoutWrapper from "./-app";
import { SessionProvider } from './session/sessiowrapper'; 

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// 1. Separate Viewport export (Next.js Best Practice)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
}

// 2. Optimized Metadata
export const metadata = {
  // IMPORTANT: Set this to your production domain so images work on social media
  metadataBase: new URL('https://mary-immaculate.vercel.app'), 
  
  title: {
    default: "Mary Immaculate Girls Secondary School | Mweiga",
    template: "%s | Mary Immaculate Girls"
  },
  description: "Official website for Mary Immaculate Girls Secondary School in Mweiga, Nyeri. A premier Catholic boarding school committed to academic excellence and holistic development.",
  
  keywords: [
    "Mary Immaculate Girls Secondary School",
    "Mweiga girls school",
    "Catholic girls secondary school Nyeri",
    "Best girls school in Nyeri",
    "Mary Immaculate Mweiga",
    "Girls boarding school Kenya",
    "KCSE performance Nyeri"
  ],
  
  authors: [{ name: "Mary Immaculate Girls Secondary School" }],
  
  // Canonical URL ensures Google knows this is the "real" version of the site
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: "Mary Immaculate Girls Secondary School | Mweiga, Nyeri",
    description: "Empowering future leaders through excellence and faith.",
    url: 'https://mary-immaculate.vercel.app',
    siteName: "Mary Immaculate Girls Secondary School",
    locale: "en_KE",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Mary Immaculate Girls Secondary School",
    description: "Premier girls' education in Mweiga, Nyeri.",
  },

  // Search Engine Bot instructions
  robots: {
    index: true,
    follow: true,
  },
  
  icons: {
    icon: "/ll.png",
    apple: "/ll.png",
  },
  verification: {
    google: "googlef8123d1ff1ecb88f", // Paste ONLY the code here
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Remove manual <head> tags here; Next.js handles them now */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900`}
      >
        <SessionProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}