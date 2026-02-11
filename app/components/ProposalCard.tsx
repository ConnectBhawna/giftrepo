"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import PixelHeart from "./PixelHeart";

/* ─── helpers ─────────────────────────────────────────────────── */

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function randomPos(btnW: number, btnH: number) {
  const pad = 24;
  const x = clamp(Math.random() * (window.innerWidth - btnW - pad * 2) + pad, pad, window.innerWidth - btnW - pad);
  const y = clamp(Math.random() * (window.innerHeight - btnH - pad * 2) + pad, pad, window.innerHeight - btnH - pad);
  return { x, y };
}

/* heart-shaped confetti using canvas-confetti */
function fireHeartConfetti() {
  const colors = ["#FF2D95", "#4CC1FF", "#FFD166"];
  const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 100 };

  // two bursts
  confetti({ ...defaults, particleCount: 60, colors, origin: { x: 0.5, y: 0.55 }, scalar: 1.1 });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 40, colors, origin: { x: 0.45, y: 0.5 }, scalar: 0.9 });
  }, 200);
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 50, colors, origin: { x: 0.55, y: 0.5 }, scalar: 1.0 });
  }, 400);
}

/* ─── component ───────────────────────────────────────────────── */

export default function ProposalCard() {
  const [confirmed, setConfirmed] = useState(false);
  const [noEscaped, setNoEscaped] = useState(false); // whether NO is currently floating
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* move the NO button to a random spot */
  const dodgeNo = useCallback(() => {
    if (confirmed) return;
    const btn = noBtnRef.current;
    if (!btn) return;
    const { width, height } = btn.getBoundingClientRect();
    const pos = randomPos(width, height);
    setNoPos(pos);
    if (!noEscaped) setNoEscaped(true);
  }, [confirmed, noEscaped]);

  /* YES handler */
  const handleYes = () => {
    setConfirmed(true);
    fireHeartConfetti();
  };

  /* For mobile: on first touch of NO, dodge once; long-press fallback handled by tooltip */
  const handleNoTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    dodgeNo();
  };

  /* Reset NO position on resize so it stays in viewport */
  useEffect(() => {
    const handler = () => {
      if (noPos) {
        const btn = noBtnRef.current;
        if (!btn) return;
        const { width, height } = btn.getBoundingClientRect();
        setNoPos(randomPos(width, height));
      }
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [noPos]);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center px-4 py-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="glass-card relative w-full max-w-lg p-8 sm:p-10 text-center"
      >
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div key="proposal" exit={{ opacity: 0, scale: 0.9 }}>
              <PixelHeart size={40} className="mx-auto mb-4 text-bull-pink" />

              <h2 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight">
                Will you be the{" "}
                <span className="text-eth-blue">Liquidity Provider</span> to my
                heart?
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                This is a one-way mainnet launch. No testnet. No going back.
              </p>

              {/* ─ Buttons ─ */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* YES */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={handleYes}
                  className="glow-pink rounded-full bg-bull-pink px-8 py-3 text-sm font-bold text-white tracking-wide transition-colors hover:bg-[#e0247f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-eth-blue"
                  aria-label="Yes, confirm the love transaction"
                >
                  YES (Confirm Transaction)
                </motion.button>

                {/* NO — in-flow when not yet escaped */}
                {!noEscaped && (
                  <motion.button
                    ref={noBtnRef}
                    whileTap={{ scale: 0.96 }}
                    onMouseEnter={dodgeNo}
                    onTouchStart={handleNoTouch}
                    className="rounded-full border border-glass-border bg-[rgba(255,255,255,0.05)] px-8 py-3 text-sm font-bold text-gray-300 tracking-wide transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                    aria-label="No, reject the love transaction (but try clicking it!)"
                  >
                    NO (Reject)
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            /* ─ Success state ─ */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
              role="alert"
              aria-live="assertive"
            >
              <PixelHeart size={48} className="mx-auto mb-4 text-bull-pink animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-bull-pink">
                Transaction Confirmed! 🎉
              </h2>
              <p className="mt-3 text-lg text-gray-300">
                Block Height: <span className="font-bold text-eth-blue">Forever</span>
              </p>
              <p className="text-lg text-gray-300">
                Gas Fees: <span className="font-bold text-gold">0</span>
              </p>
              <p className="mt-5 text-sm text-gray-500">
                You are now my <span className="text-bull-pink font-semibold">Governance Partner</span>.
                We are officially <span className="text-eth-blue font-semibold">merging our chains</span>. 💕
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─ Floating escaped NO button (fixed position) ─ */}
      <AnimatePresence>
        {noEscaped && !confirmed && noPos && (
          <motion.button
            ref={noBtnRef}
            key="no-floating"
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onMouseEnter={dodgeNo}
            onTouchStart={handleNoTouch}
            style={{ position: "fixed", top: 0, left: 0, zIndex: 50 }}
            className="rounded-full border border-glass-border bg-[rgba(20,20,20,0.92)] backdrop-blur-md px-8 py-3 text-sm font-bold text-gray-300 tracking-wide transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            aria-label="No, reject the love transaction (but try clicking it!)"
          >
            NO (Reject)
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
