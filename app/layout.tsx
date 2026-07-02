import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ClaimTrace",
  description: "AI-powered insurance fraud detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${instrumentSans.variable} font-sans antialiased bg-gray-950 text-gray-50 flex flex-col min-h-screen`}>
        <TooltipProvider>
          <Navbar />
          <main className="flex-1 flex flex-col pt-20">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
