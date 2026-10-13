import { ARCHIVES_START_DATE } from "@/lib/globals";
import Link from "next/link";

function MonthCard(month: string) {
  return (
    <Link
      className="p-5 bg-surface-card rounded-card space-y-3 text-center cursor-pointer border-2 border-transparent hover:border-accent transition-border duration-180 ease-out shadow-md"
      key={month}
      href={`/archives/${month.replace(" ","-").toLowerCase()}/1`}
    >
      {month}
    </Link>
  );
}

export default function Archives() {
  const i = new Date();
  const months = [];
  const startDate = new Date(ARCHIVES_START_DATE);

  while (+i > +startDate) {
    months.push(
      MonthCard(
        i.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      ),
    );
    i.setMonth(i.getMonth() - 1);
  }

  return <main className="p-6 grid grid-cols-2 gap-6 flex-1 md:grid-cols-3 lg:grid-cols-4 max-w-300 w-full mx-auto">{months}</main>;
}
