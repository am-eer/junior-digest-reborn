import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import SearchButton from "@/components/SearchButton";

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
            <SearchButton />
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