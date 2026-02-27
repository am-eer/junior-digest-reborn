import Link from "next/link";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Function that takes a page number and returns the href string for that page */
  buildHref: (page: number) => string;
}

/**
 * Builds the list of page numbers to display.
 * Always shows first page, last page, current page, and up to 2 neighbors
 * on each side. Uses -1 as sentinel for ellipsis gaps.
 */
function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);

  // Current page and its neighbors (±2)
  for (let i = current - 2; i <= current + 2; i++) {
    if (i >= 1 && i <= total) {
      pages.add(i);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);

  // Insert ellipsis sentinels (-1) where there are gaps
  const result: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push(-1);
    }
    result.push(sorted[i]);
  }

  return result;
}

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const navBtnBase =
    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ease-out shrink-0";
  const navBtnEnabled =
    "text-text-secondary border border-accent-subtle hover:border-accent hover:text-accent hover:scale-105 active:scale-95 cursor-pointer";
  const navBtnDisabled =
    "text-text-secondary/30 border border-accent-subtle/40 pointer-events-none";

  return (
    <nav
      aria-label="Page navigation"
      className="flex items-center justify-center gap-1.5 py-8 px-4 select-none max-w-[1200px] w-full mx-auto"
    >
      {/* First page */}
      {isFirst ? (
        <span className={`${navBtnBase} ${navBtnDisabled}`} aria-disabled="true">
          <ChevronFirst className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={buildHref(1)}
          className={`${navBtnBase} ${navBtnEnabled}`}
          aria-label="First page"
        >
          <ChevronFirst className="w-4 h-4" />
        </Link>
      )}

      {/* Previous page */}
      {isFirst ? (
        <span className={`${navBtnBase} ${navBtnDisabled}`} aria-disabled="true">
          <ChevronLeft className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={buildHref(currentPage - 1)}
          className={`${navBtnBase} ${navBtnEnabled}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-1 sm:mx-3">
        {pages.map((page, idx) =>
          page === -1 ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-text-secondary/50 text-sm"
              aria-hidden="true"
            >
              …
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-accent text-white text-sm font-medium shadow-md shadow-accent/25"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-sm text-text-secondary hover:bg-accent-subtle hover:text-accent-dark transition-all duration-200 ease-out hover:scale-105 active:scale-95"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next page */}
      {isLast ? (
        <span className={`${navBtnBase} ${navBtnDisabled}`} aria-disabled="true">
          <ChevronRight className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={buildHref(currentPage + 1)}
          className={`${navBtnBase} ${navBtnEnabled}`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}

      {/* Last page */}
      {isLast ? (
        <span className={`${navBtnBase} ${navBtnDisabled}`} aria-disabled="true">
          <ChevronLast className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={buildHref(totalPages)}
          className={`${navBtnBase} ${navBtnEnabled}`}
          aria-label="Last page"
        >
          <ChevronLast className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}