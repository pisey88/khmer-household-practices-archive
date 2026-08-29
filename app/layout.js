import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Serif for headings — editorial, museum-label feel.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

// Sans for body text, metadata, and navigation.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Khmer Household Archive",
  description:
    "A cultural archive documenting traditional household practices in Kampong Speu Province, Cambodia, before modern appliances became common.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}