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
  title: "Katwanyaa High School | Nurturing Excellence, Shaping Futures",
  description:
    "Official website for Katwanyaa High School. Discover our academic programs, vibrant community, and achievements in STEAM and co-curricular activities.",
  icons: {
    icon: [
      { url: "/lll.png", type: "image/png", sizes: "32x32" },
      { url: "/lll.png", type: "image/png", sizes: "32x32" },
    ],
  apple: "/lll.png",},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <SessionProvider> {/* 👈 Wrap with custom provider */}
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}