"use client";

import { Fraunces, Inter, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import { LanguageProvider, useLanguage } from "../components/common/LanguageProvider.js";
import Navigation from "../components/layout/Navigation.js";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["400", "500", "600"],
  variable: "--font-khmer",
  display: "swap",
});

function RootContent({ children }) {
  const { language } = useLanguage();

  return (
    <html
      lang={language}
      className={`${fraunces.variable} ${inter.variable} ${notoSansKhmer.variable}`}
    >
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <LanguageProvider>
      <RootContent>{children}</RootContent>
    </LanguageProvider>
  );
}