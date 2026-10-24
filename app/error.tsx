"use client";

import { useEffect } from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mt-15 px-4 md:px-6 lg:px-8 py-6 text-center flex-1 grid place-items-center max-w-300 w-full mx-auto">
      <p className="text-center text-xl">Content could not be loaded.</p>
      <button
        className="mt-6 px-5 py-3 bg-surface-card rounded-card space-y-3 text-center cursor-pointer border-2 border-transparent hover:border-accent transition-border duration-180 ease-out shadow-md"
        onClick={() => reset()}>
        Reload
      </button>
    </main>
  );
}