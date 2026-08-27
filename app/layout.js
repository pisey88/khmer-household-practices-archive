// app/layout.js

import collection from "../collection.config.js";

export const metadata = {
  title: collection.name,
  description: collection.description,
};

const globalStyles = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background-color: #F7F1E5;
    color: #2B2622;
    font-family: -apple-system, "Segoe UI", "Noto Sans Khmer", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; }
  .archive-link {
    color: #A34F32;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;
  }
  .archive-link:hover {
    border-bottom-color: #A34F32;
  }
  .archive-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .archive-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(43, 38, 34, 0.08);
  }
  @media (max-width: 640px) {
    .hero-title { font-size: 34px !important; }
    .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}