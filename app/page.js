import Hero from "../components/archive/Hero.js";
import AboutCollection from "../components/archive/AboutCollection.js";
import ArchiveGrid from "../components/archive/ArchiveGrid.js";
import Footer from "../components/layout/Footer.js";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <AboutCollection />
        <ArchiveGrid />
      </main>
      <Footer />
    </>
  );
}