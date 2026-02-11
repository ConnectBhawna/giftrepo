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
const heartShape = confetti.shapeFromPath({
  path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
});

function fireHeartConfetti() {
  const colors = ["#FF2D95", "#ff6db8", "#ff85c8", "#FFD166", "#ff4fa8"];
  const defaults = {
    spread: 360,
    ticks: 120,
    zIndex: 100,
    shapes: [heartShape],
    scalar: 1.8,
  };

  // big central burst of hearts
  confetti({
    ...defaults,
    particleCount: 50,
    colors,
    startVelocity: 30,
    origin: { x: 0.5, y: 0.55 },
  });

  // second wave — slightly offset, more hearts
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 35,
      colors,
      startVelocity: 25,
      origin: { x: 0.4, y: 0.5 },
      scalar: 1.5,
    });
    confetti({
      ...defaults,
      particleCount: 35,
      colors,
      startVelocity: 25,
      origin: { x: 0.6, y: 0.5 },
      scalar: 1.5,
    });
  }, 250);

  // third wave — gentle shower from top
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 40,
      colors,
      startVelocity: 15,
      origin: { x: 0.3, y: 0.3 },
      scalar: 2.0,
      gravity: 0.6,
    });
    confetti({
      ...defaults,
      particleCount: 40,
      colors,
      startVelocity: 15,
      origin: { x: 0.7, y: 0.3 },
      scalar: 2.0,
      gravity: 0.6,
    });
  }, 500);

  // final delayed burst — big floating hearts
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 25,
      colors,
      startVelocity: 20,
      origin: { x: 0.5, y: 0.45 },
      scalar: 2.4,
      gravity: 0.4,
      ticks: 160,
    });
  }, 800);
}

/* ─── component ───────────────────────────────────────────────── */

export default function ProposalCard() {
  const [confirmed, setConfirmed] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [noEscaped, setNoEscaped] = useState(false);
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

  /* Envelope click handler */
  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    fireHeartConfetti();
  };

  /* For mobile: on first touch of NO, dodge once */
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

  /* ─── Determine which step we're on ─── */
  // Step 1: proposal question
  // Step 2: confirmed → show envelope
  // Step 3: envelope opened → show letter + boarding pass
  const step = !confirmed ? 1 : !envelopeOpened ? 2 : 3;

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center px-4 py-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className={`glass-card relative w-full p-8 sm:p-10 text-center ${step === 3 ? "max-w-2xl" : "max-w-lg"}`}
      >
        <AnimatePresence mode="wait">
          {/* ─── Step 1: Proposal ─── */}
          {step === 1 && (
            <motion.div key="proposal" exit={{ opacity: 0, scale: 0.9 }}>
              <PixelHeart size={40} className="mx-auto mb-4 text-bull-pink" />

              <h2 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight">
                Will you be the{" "}
                <span className="text-eth-blue">Liquidity Provider</span> to my
                heart?
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                This is a one-way mainnet launch, no testnet & no going back.
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
          )}

          {/* ─── Step 2: Envelope (clickable) ─── */}
          {step === 2 && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
              className="flex flex-col items-center"
            >
              <PixelHeart size={36} className="mx-auto mb-3 text-bull-pink animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-bull-pink mb-2">
                Transaction Confirmed!
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                You have a special letter waiting for you…
              </p>

              {/* ── Envelope ── */}
              <motion.button
                onClick={handleOpenEnvelope}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="envelope-wrapper group relative cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-eth-blue"
                aria-label="Open the envelope"
              >
                {/* envelope body */}
                <div className="relative w-64 h-44 sm:w-72 sm:h-48">
                  {/* back */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF2D95] to-[#ff6db8] shadow-lg shadow-bull-pink/30" />
                  {/* inner fold */}
                  <div className="absolute inset-x-0 bottom-0 h-[60%] rounded-b-xl bg-gradient-to-b from-[#e0247f] to-[#c91a6b]" />
                  {/* flap (triangle) */}
                  <div className="envelope-flap absolute inset-x-0 top-0 h-[45%] origin-top">
                    <svg viewBox="0 0 288 110" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
                      <polygon points="0,0 288,0 144,110" fill="#ff6db8" />
                    </svg>
                  </div>
                  {/* heart seal */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-lg">
                        <PixelHeart size={28} className="text-white drop-shadow-md" />
                      </div>
                      <div className="absolute -inset-2 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors envelope-pulse" />
                    </div>
                  </div>
                </div>
                {/* label */}
                <p className="mt-5 text-xs text-gray-400 group-hover:text-gray-300 transition-colors tracking-wider uppercase">
                   Tap to open 
                </p>
              </motion.button>
            </motion.div>
          )}

          {/* ─── Step 3: Opened envelope → Letter + Boarding Pass ─── */}
          {step === 3 && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="flex flex-col items-center"
            >
              {/* ── Letter content ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <PixelHeart size={40} className="mx-auto mb-3 text-bull-pink float-heart" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-bull-pink leading-snug">
                  Transaction Confirmed! 
                </h2>
                <div className="mt-5 space-y-3 text-left max-w-md mx-auto">
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                    You are now my{" "}
                    <span className="text-bull-pink font-bold">Governance Partner</span>.
                    We are officially{" "}
                    <span className="text-eth-blue font-bold">merging our chains</span>{" "}
                    in <span className="text-gold font-bold">Mumbai</span> on{" "}
                    <span className="text-gold font-bold">10th March 2026</span> 💕
                  </p>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    Here is your boarding pass for the same🎫
                  </p>
                </div>
              </motion.div>

              {/* ── Boarding Pass ── */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 14 }}
                className="mt-8 w-full max-w-md"
              >
                <div className="boarding-pass relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-glass-border shadow-xl">
                  {/* top accent bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-bull-pink via-eth-blue to-gold" />

                  {/* header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <PixelHeart size={18} className="text-bull-pink" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Love Airlines
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Boarding Pass
                    </span>
                  </div>

                  {/* main route */}
                  <div className="flex items-center justify-between px-5 py-3">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-extrabold text-white">UAE</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Dubai</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-3">
                      <div className="flex items-center gap-1 w-full">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-bull-pink to-transparent opacity-40" />
                        <PixelHeart size={16} className="text-bull-pink shrink-0" />
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-bull-pink to-transparent opacity-40" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-extrabold text-white">BOM</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Mumbai</p>
                    </div>
                  </div>

                  {/* dashed divider with circles */}
                  <div className="relative flex items-center px-0 my-1">
                    <div className="w-4 h-8 bg-bg-dark rounded-r-full -ml-px" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-700" />
                    <div className="w-4 h-8 bg-bg-dark rounded-l-full -mr-px" />
                  </div>

                  {/* details grid */}
                  <div className="grid grid-cols-3 gap-3 px-5 py-3 text-center">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="text-sm font-bold text-white mt-0.5">10 MAR 2026</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Gate</p>
                      <p className="text-sm font-bold text-eth-blue mt-0.5">FOREVER</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Seat</p>
                      <p className="text-sm font-bold text-bull-pink mt-0.5">❤️ 1A</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Flight</p>
                      <p className="text-sm font-bold text-gold mt-0.5">LOVE-69</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Class</p>
                      <p className="text-sm font-bold text-white mt-0.5">FIRST</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Gas Fee</p>
                      <p className="text-sm font-bold text-gold mt-0.5">0 ETH</p>
                    </div>
                  </div>

                  {/* passenger */}
                  <div className="relative flex items-center px-0 my-1">
                    <div className="w-4 h-8 bg-bg-dark rounded-r-full -ml-px" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-700" />
                    <div className="w-4 h-8 bg-bg-dark rounded-l-full -mr-px" />
                  </div>
                  <div className="px-5 pb-4 pt-2 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Passenger</p>
                      <p className="text-sm font-bold text-white mt-0.5">My Governance Partner 💕</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Status</p>
                      <p className="text-sm font-bold text-bull-pink mt-0.5 flex items-center gap-1 justify-end">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        CONFIRMED
                      </p>
                    </div>
                  </div>

                  {/* bottom accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-bull-pink via-eth-blue to-gold" />
                </div>
              </motion.div>

              {/* tiny footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-xs text-gray-600"
              >
                Block Height: <span className="text-eth-blue font-bold">Forever</span> • This transaction is irreversible 💕
              </motion.p>
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
