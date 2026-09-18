// components/layout/Footer.js

"use client";

import { useLanguage } from "../common/LanguageProvider.js";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <p className="label">{t("siteTitle")}</p>
      <p className="footer-note">{t("footerTagline")}</p>
    </footer>
  );
}
