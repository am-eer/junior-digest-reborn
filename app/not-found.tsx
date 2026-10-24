"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Newspaper, Archive, Users, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="px-4 md:px-6 lg:px-8 py-10 md:py-16 flex-1 flex flex-col items-center justify-center max-w-300 w-full mx-auto">
      <div className="relative w-full max-w-2xl bg-surface-card rounded-container p-8 md:p-12 text-center border-2 border-accent/20 shadow-xl overflow-hidden">
        {/* Ambient subtle decorative background glows */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-accent-subtle/40 dark:bg-accent/10 blur-3xl pointer-events-none" />

        {/* 404 Hero Display */}
        <div className="relative select-none my-2">
          <span className="text-display text-8xl md:text-9xl font-extrabold tracking-tight text-accent inline-block drop-shadow-sm">
            404
          </span>
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-heading text-2xl md:text-3xl text-foreground font-semibold mb-3">
          Lost in the Headlines?
        </h1>
        <p className="text-body text-text-secondary max-w-lg mx-auto mb-8 text-base">
          The article or page you are looking for might have been moved, renamed,
          or is temporarily unavailable in our digest.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-dark text-white font-medium text-meta transition-all duration-180 ease-out shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Newspaper className="w-4 h-4" />
            <span>Latest News</span>
          </Link>
          <button
            type="button"
            onClick={handleGoBack}
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-background-secondary/70 hover:bg-background-secondary border border-accent-subtle text-foreground font-medium text-meta transition-all duration-180 ease-out hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links Section */}
        <div className="pt-8 border-t border-accent/15 w-full">
          <p className="text-meta text-text-secondary mb-4 uppercase tracking-wider text-xs font-medium">
            Explore Other Sections
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background hover:bg-accent-subtle/60 text-meta text-foreground border border-accent/20 transition-all duration-180 hover:border-accent"
            >
              <Archive className="w-4 h-4 text-accent" />
              <span>Archives</span>
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background hover:bg-accent-subtle/60 text-meta text-foreground border border-accent/20 transition-all duration-180 hover:border-accent"
            >
              <Users className="w-4 h-4 text-accent" />
              <span>Editorial Team</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
