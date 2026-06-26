"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => {
                if (window.history.length > 1) {
                    router.back();
                } else {
                    router.push("/");
                }
            }}
            className="cursor-pointer inline-flex items-center gap-2 text-meta text-text-secondary hover:text-accent transition-colors duration-180 group"
        >
            <ArrowLeft size={16} className="transition-transform duration-180 group-hover:-translate-x-1" />
            Go Back
        </button>
    );
}