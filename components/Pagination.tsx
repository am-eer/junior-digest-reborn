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
    return Array.from({ length: total }, (e, i) => i + 1);
  }

  const pages = [1];
  // Insert ellipsis sentinels (-1) where there are gaps
  if(current > 3 ) pages.push(-1);
  // Current page and its neighbors (±2)
  const leftOffset = current > total - 3 ? current - total + 2 : 0;
  const rightOffset = current < 3? 3 - current : 0;
  for (let i = current - 2 - leftOffset; i <= current + 2 + rightOffset; i++) {
    if (i > 1 && i < total) {
      pages.push(i);
    }
  }
  // Insert ellipsis sentinels (-1) where there are gaps
  if(total > current + 3) pages.push(-1);
  pages.push(total);
  return pages;
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
    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-180 ease-out shrink-0";
  const navBtnEnabled =
    "text-text-secondary border border-accent-subtle hover:border-accent hover:text-accent active:cursor-pointer";
  const navBtnDisabled =
    "text-text-secondary/30 border border-accent-subtle/40 pointer-events-none";

  return (
    <nav
      aria-label="Page navigation"
      className="flex items-center justify-center py-8 px-4 select-none max-w-300 w-full mx-auto md:gap-1.5"
    >
      {/* First page button */}
      <Link
        href={buildHref(1)}
        className={`${navBtnBase} ${isFirst ? navBtnDisabled : navBtnEnabled} hidden md:flex`}
        aria-disabled={isFirst}
        aria-label="First page"
      >
        <ChevronFirst className="w-4 h-4" />
      </Link>

      {/* Previous page button */}
      <Link
        href={buildHref(currentPage - 1)}
        className={`${navBtnBase} ${isFirst ? navBtnDisabled : navBtnEnabled}`}
        aria-disabled={isFirst}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-1 md:mx-3">
        {pages.map((page, idx) =>
          page === -1 ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 hidden items-center justify-center text-text-secondary/50 text-sm md:flex"
              aria-hidden="true"
            >
              …
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-accent text-white text-sm font-medium"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className={`w-9 h-9 ${(page === 1 && currentPage > 3) || (page === totalPages && currentPage < totalPages - 3) ? "hidden" : "flex"} items-center justify-center rounded-full text-sm text-text-secondary hover:bg-accent-subtle hover:text-accent-dark transition-all duration-180 ease-out md:flex`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next page button */}
      <Link
        href={buildHref(currentPage + 1)}
        className={`${navBtnBase} ${isLast ? navBtnDisabled : navBtnEnabled}`}
        aria-disabled={isLast}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Link>

      {/* Last page button */}
      <Link
        href={buildHref(totalPages)}
        className={`${navBtnBase} ${isLast ? navBtnDisabled : navBtnEnabled} hidden md:flex`}
        aria-disabled={isLast}
        aria-label="Last page"
      >
        <ChevronLast className="w-4 h-4" />
      </Link>
    </nav>
  );
}