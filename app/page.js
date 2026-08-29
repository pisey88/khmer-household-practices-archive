import Navigation from "../components/Navigation.js";
import Hero from "../components/Hero.js";
import AboutCollection from "../components/AboutCollection.js";
import EntryList from "../components/EntryList.js";
import Footer from "../components/Footer.js";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutCollection />
        <EntryList />
      </main>
      <Footer />
    </>
  );
}
