import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LootNova — Community Reward Requests",
  description: "Request and track community giveaway rewards for Free Fire and Roblox. Manual admin review, no passwords or OTPs.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
