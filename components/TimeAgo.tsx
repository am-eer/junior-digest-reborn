"use client";

import { useEffect, useState } from "react";

interface Props {
    dateGmt: string; // e.g. "2025-07-12T16:30:53"
    className?: string;
}

type TimeUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

const UNITS: { unit: TimeUnit; seconds: number }[] = [
    { unit: "year",   seconds: 365.25 * 24 * 60 * 60 },
    { unit: "month",  seconds: 30.44  * 24 * 60 * 60 },
    { unit: "week",   seconds: 7      * 24 * 60 * 60 },
    { unit: "day",    seconds: 24     * 60 * 60 },
    { unit: "hour",   seconds: 60     * 60 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
];

function getRelativeTime(dateGmt: string): string {
    // Append "Z" so the date is interpreted as UTC/GMT
    const then = new Date(dateGmt.endsWith("Z") ? dateGmt : dateGmt + "Z");
    const nowUtc = Date.now();
    const diffSeconds = Math.round((nowUtc - then.getTime()) / 1000);

    // Handle future dates or just now
    if (diffSeconds < 1) return "just now";

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    for (const { unit, seconds } of UNITS) {
        const value = Math.floor(diffSeconds / seconds);
        if (value >= 1) {
            // RelativeTimeFormat expects a negative value for "ago"
            return rtf.format(-value, unit);
        }
    }

    return "just now";
}

export default function TimeAgo({ dateGmt, className }: Props) {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        setText(getRelativeTime(dateGmt));
    }, [dateGmt]);

    // Render nothing on the server to avoid hydration mismatch
    if (!text) return null;

    return (
        <time dateTime={dateGmt} className={className}>
            {text}
        </time>
    );
}
