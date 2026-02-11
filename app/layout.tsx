import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Have a great day bby💕",
  description:
    "A fully decentralized, rug-proof protocol for proving love on-chain. Will you be the Liquidity Provider to my heart?",
  openGraph: {
    title: "Love Protocol v1.4",
    description: "Will you be the Liquidity Provider to my heart?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
