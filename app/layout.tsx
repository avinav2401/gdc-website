import type { Metadata } from "next";
import { Press_Start_2P, Silkscreen, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Retro 8-Bit Headers / Titles
const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-arcade",
  subsets: ["latin"],
  display: "swap",
});

// Crisp Pixel UI / Badges / Buttons
const silkscreen = Silkscreen({
  weight: ["400", "700"],
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

// Readable Pixelated Body & Subheadings
const pixelifySans = Pixelify_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GDC | Game Developers Community",
  description: "CREATE. CODE. CONQUER. The ultimate platform for game developers, designers, and creators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${silkscreen.variable} ${pixelifySans.variable}`}
    >
      <body className="min-h-screen flex flex-col font-body bg-[#07080D] text-white antialiased selection:bg-[#FF007F] selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}