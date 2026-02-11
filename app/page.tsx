import Ticker from "./components/Ticker";
import Hero from "./components/Hero";
import ProposalCard from "./components/ProposalCard";
import Footer from "./components/Footer";
import BackgroundHearts from "./components/BackgroundHearts";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg-dark font-mono">
      <BackgroundHearts />
      <Ticker />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <Hero />
        <ProposalCard />
      </main>
      <Footer />
    </div>
  );
}
