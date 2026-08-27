// app/page.js

import collection from "../collection.config.js";

const colors = {
  bg: "#F7F1E5",
  cardBg: "#FBF7F0",
  text: "#2B2622",
  textMuted: "#6F655C",
  accent: "#A34F32",
  border: "#E3D8C8",
};

const styles = {
  header: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "28px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${colors.border}`,
  },
  wordmark: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  nav: {
    display: "flex",
    gap: 24,
    fontSize: 14,
    color: colors.textMuted,
  },
  hero: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "72px 24px 56px",
    textAlign: "center",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: colors.accent,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 46,
    fontWeight: 700,
    lineHeight: 1.2,
    margin: "18px 0 16px",
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.textMuted,
    lineHeight: 1.6,
    margin: "0 0 28px",
  },
  cta: {
    display: "inline-block",
    fontSize: 15,
    fontWeight: 600,
  },
  section: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 24px",
    borderTop: `1px solid ${colors.border}`,
  },
  sectionLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.accent,
    textTransform: "uppercase",
    margin: "0 0 12px",
  },
  sectionTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 16px",
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 1.7,
    color: colors.text,
    margin: "0 0 12px",
  },
  card: {
    padding: 20,
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    marginTop: 20,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  cardValue: {
    fontSize: 15,
    margin: 0,
    overflowWrap: "break-word",
  },
  topicRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  topicTag: {
    fontSize: 13,
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: 20,
    padding: "6px 14px",
  },
  footer: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "40px 24px 64px",
    borderTop: `1px solid ${colors.border}`,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 1.7,
  },
};

export default function Home() {
  return (
    <main>
      <header className="section-pad" style={styles.header}>
        <span style={styles.wordmark}>Khmer Living Archive</span>
        <nav style={styles.nav}>
          <a className="archive-link" href="#about">About</a>
          <a className="archive-link" href="#collection">Collection</a>
        </nav>
      </header>

      <section className="section-pad" style={styles.hero}>
        <p style={styles.kicker}>Khmer Living Archive</p>
        <h1 className="hero-title" style={styles.heroTitle}>
          {collection.name}
        </h1>
        <p style={styles.heroSubtitle}>
          Everyday knowledge, tools, and memories from Kampong Speu Province.
        </p>
        <a className="archive-link" style={styles.cta} href="#collection">
          Explore the archive →
        </a>
      </section>

      <section id="about" className="section-pad" style={styles.section}>
        <p style={styles.sectionLabel}>About the Collection</p>
        <h2 style={styles.sectionTitle}>What this archive holds</h2>
        <p style={styles.bodyText}>{collection.description}</p>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Curated by</p>
          <p style={styles.cardValue}>{collection.curator}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Source</p>
          <p style={styles.cardValue}>{collection.source}</p>
        </div>
      </section>

      <section id="collection" className="section-pad" style={styles.section}>
        <p style={styles.sectionLabel}>The Collection</p>
        <h2 style={styles.sectionTitle}>Entries</h2>
        <p style={styles.bodyText}>
          The collection is just beginning — no entries have been recorded
          yet. Each one will document a single household practice: the
          method, the tools, and the person who remembers it.
        </p>
        <p style={{ ...styles.bodyText, color: colors.textMuted, fontSize: 14 }}>
          Subjects this archive intends to document include:
        </p>
        <div style={styles.topicRow}>
          {[
            "Charcoal & wood stoves",
            "Oil & kerosene lamps",
            "Rice flour-making",
            "Rice winnowing",
            "Charcoal irons",
          ].map((topic) => (
            <span key={topic} style={styles.topicTag}>
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section className="section-pad" style={styles.section}>
        <p style={styles.sectionLabel}>From Kampong Speu</p>
        <p style={styles.bodyText}>
          These are not stories from books. They come from grandparents and
          older community members in Kampong Speu Province who carried
          water, cooked over charcoal, and hand-washed clothes long before
          any of it had a plug. This archive exists so that knowledge isn't
          lost to convenience.
        </p>
      </section>

      <footer className="section-pad" style={styles.footer}>
        A record of Khmer household life before modern appliances, built and
        maintained one entry at a time. Part of ICT 340, American University
        of Phnom Penh — growing all semester.
      </footer>
    </main>
  );
}