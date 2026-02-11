"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-8 text-center candlestick-bg">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-xs sm:text-sm tracking-widest uppercase text-eth-blue"
      >
        ● Network Online — Validators: 2 Hearts
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="max-w-2xl text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
      >
        Checking Network Status:{" "}
        <span className="text-bull-pink">Love Protocol</span>{" "}
        <span className="text-eth-blue">v1.4</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5 max-w-md text-sm text-gray-500"
      >
        A fully decentralized, rug-proof protocol for proving love on-chain.
      </motion.p>
    </section>
  );
}
