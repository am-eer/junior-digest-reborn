import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Search } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    <html lang="en" className="min-h-full" suppressHydrationWarning>
      <body
        className={`${poppinsFont.variable} antialiased min-h-full flex flex-col font-sans bg-gradient bg-cover bg-center bg-fixed bg-no-repeat dark:bg-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <header className="py-4 flex justify-between items-center max-w-[1200px] w-full mx-auto px-4 md:px-6 lg:px-8 rounded-b-3xl">
            <ThemeToggle />
            <h1 className="text-display text-xl md:text-2xl">Junior Digest</h1>
            <button className="p-2 rounded-full border border-border-subtle cursor-pointer hover:border-accent hover:text-accent transition-all duration-180 ease-out">
              <Search className="h-5 w-5" />
            </button>
          </header>
          <Navbar />
          {children}
          <footer className="mt-auto py-6 text-center text-meta text-text-secondary max-w-[1200px] w-full mx-auto px-4 md:px-6 lg:px-8 rounded-t-3xl">
            &copy; {(new Date()).getFullYear()} Junior Digest
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}