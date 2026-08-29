// components/Footer.js

import { collectionConfig } from "../collection.config.js";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="label">{collectionConfig.siteTitle}</p>
      <p className="footer-note">
        Preserving everyday household knowledge from {collectionConfig.province},{" "}
        {collectionConfig.country}, one memory at a time.
      </p>
    </footer>
  );
}