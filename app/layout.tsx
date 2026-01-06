import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Moon, Search } from 'lucide-react';
import Navbar from "@/components/Navbar";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Junior Digest",
  description: "News blog website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${interFont.variable} antialiased min-h-full flex flex-col`}
      >
        <header className="px-52 py-4 text-2xl1 font-semibold text-center border-b border-b-gray-50 dark:border-b-gray-900 flex justify-between items-center">
          <Moon />
          <h1>Junior Digest</h1>
          <Search />
        </header>
        <Navbar />
        {children}
        <footer className="mt-2 py-4 text-center border-t border-t-gray-50 dark:border-t-gray-900">&copy; {(new Date()).getFullYear()} Junior Digest</footer>
      </body>
    </html>
  );
}