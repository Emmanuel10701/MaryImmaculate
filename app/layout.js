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

export const metadata = {
  title: "Mary Immaculate Girls Secondary School | Empowering Future Leaders",
  description:
    "Official website for Mary Immaculate Girls Secondary School, Mweiga. A premier Catholic girls' institution committed to academic excellence, character formation, and holistic development of future women leaders.",
  icons: {
    icon: [
      { url: "/ll.png", type: "image/png", sizes: "32x32" },
      { url: "/ll.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/ll.png",
  },
  keywords: [
    "Mary Immaculate Girls Secondary School",
    "Mweiga girls school",
    "Catholic girls secondary school",
    "Nyeri girls education",
    "Mary Immaculate Mweiga",
    "Girls boarding school Kenya"
  ],
  authors: [{ name: "Mary Immaculate Girls Secondary School" }],
  openGraph: {
    title: "Mary Immaculate Girls Secondary School | Mweiga, Nyeri",
    description: "Premier Catholic girls' institution in Mweiga, Nyeri",
    type: "website",
    locale: "en_KE",
    siteName: "Mary Immaculate Girls Secondary School",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ea580c" />
      </head>
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