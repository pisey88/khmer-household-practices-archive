"use client";

import { useLanguage } from "../../components/common/LanguageProvider.js";
import AboutCollection from "../../components/archive/AboutCollection.js";
import Footer from "../../components/layout/Footer.js";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <main className="archive-page about-page">
        <AboutCollection />
      </main>
      <Footer />
    </>
  );
}