export default function Loading() {
  return (
    <div className="w-full animate-pulse flex-1 flex flex-col">
      {/* Category filter silhouette */}
      <div className="max-w-300 w-full mx-auto mb-4 px-4 md:px-6 lg:px-8 mt-6">
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full border border-accent-subtle bg-background-secondary shrink-0" />
          <div className="flex gap-2 overflow-hidden w-full px-2">
            <div className="h-7 w-full rounded-full bg-background-secondary shrink-0" />
          </div>
          <div className="w-7 h-7 rounded-full border border-accent-subtle bg-background-secondary shrink-0" />
        </div>
      </div>

      {/* Article grid silhouette */}
      <main className="px-4 md:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6 flex-1 md:grid-cols-2 lg:grid-cols-3 max-w-300 w-full mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative p-5 h-100 overflow-clip bg-surface-card rounded-card space-y-3 text-left border-2 border-transparent shadow-md"
          >
            {/* Thumbnail */}
            <div className="w-full h-48 bg-background-secondary rounded-2xl" />

            {/* Date tag */}
            <div className="h-4 w-20 bg-background-secondary rounded-full" />

            {/* Title */}
            <div className="pt-3 space-y-2">
              <div className="h-5 w-4/5 bg-background-secondary rounded-md" />
              <div className="h-5 w-3/5 bg-background-secondary rounded-md" />
            </div>

            {/* Excerpt */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full bg-background-secondary rounded-md" />
              <div className="h-3.5 w-11/12 bg-background-secondary rounded-md" />
              <div className="h-3.5 w-4/5 bg-background-secondary rounded-md" />
            </div>
          </div>
        ))}
      </main>

      {/* Pagination silhouette */}
      <nav className="flex items-center justify-center py-8 px-4 select-none max-w-300 w-full mx-auto md:gap-1.5">
        <div className="w-9 h-9 rounded-full border border-accent-subtle/50 bg-background-secondary hidden md:flex shrink-0" />
        <div className="w-9 h-9 rounded-full border border-accent-subtle/50 bg-background-secondary flex shrink-0" />

        <div className="h-9 w-48 md:w-72 rounded-full bg-background-secondary mx-1 md:mx-3 shrink-0" />

        <div className="w-9 h-9 rounded-full border border-accent-subtle/50 bg-background-secondary flex shrink-0" />
        <div className="w-9 h-9 rounded-full border border-accent-subtle/50 bg-background-secondary hidden md:flex shrink-0" />
      </nav>
    </div>
  );
}
