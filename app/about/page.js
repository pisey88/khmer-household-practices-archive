"use client";

import { useLanguage } from "../../components/common/LanguageProvider.js";
import AboutCollection from "../../components/archive/AboutCollection.js";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="archive-page">
      <AboutCollection />
    </main>
  );
}