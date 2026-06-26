"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="cursor-pointer inline-flex items-center gap-2 text-meta text-text-secondary hover:text-accent transition-colors duration-180 group"
            title="Copy link"
        >
            {copied ? (
                <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-500">Copied!</span>
                </>
            ) : (
                <>
                    <Share2 size={16} className="transition-transform duration-180 group-hover:scale-110" />
                    Share
                </>
            )}
        </button>
    );
}
