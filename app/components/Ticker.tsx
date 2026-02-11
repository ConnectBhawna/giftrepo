"use client";

const items = [
  "BTC Price, Dropping like crazy",
  "My Love for You, Breaking All-Time Highs (ATH)",
  "ETH Gas, FREE when it comes to you",
  "Commitment Level, Mainnet Launch",
  "Trust Score, Proof of Stake",
  "Sentiment, I'm Bullish on Us💕 ",
];

export default function Ticker() {
  // Duplicate the list so the marquee looks seamless
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-b border-glass-border bg-[rgba(255,255,255,0.02)] py-2">
      <div className="ticker-track">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="mx-8 whitespace-nowrap text-xs sm:text-sm tracking-wide text-gray-400"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
