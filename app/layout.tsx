import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/server-auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockSense - AI signals for CSE stocks",
  description:
    "StockSense reads the market's news as it breaks and turns it into clear, explained direction signals for CSE stocks.",
  openGraph: {
    title: "StockSense - AI signals for CSE stocks",
    description:
      "Understand what every CSE headline means for your stocks. News-driven AI signals with confidence and a transparent decision trail.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers initialUser={user}>{children}</Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
