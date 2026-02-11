export default function Footer() {
  return (
    <footer className="w-full py-8 text-center text-xs sm:text-sm text-gray-600 border-t border-glass-border">
      <p>
        Built by<span className="text-bull-pink font-semibold"> Heart Chain of Bhawna</span> which contains No rug pulls, just hugs 💕
      </p>
      <p className="mt-1 text-[10px] text-gray-700">
        © {new Date().getFullYear()} All rights reserved on-chain by Bhawna
      </p>
    </footer>
  );
}
