"use client";

import Link from "next/link";
import { CUSTOM_API_JSON_URL, INITIAL_CATEGORIES } from "@/lib/globals";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchWordPressJSON } from "@/lib/utils";

interface category {
    id: number
    name: string,
}

interface Props {
    categoryId?: number,
}

let initialCategories = [{id:-1, name:"All"}];
if(INITIAL_CATEGORIES === undefined) {
    console.log("Environment variable INITIAL_CATEGORIES is not defined");
} else {
    try {
        initialCategories = JSON.parse(INITIAL_CATEGORIES);
    } catch(e) {
        console.log("Failed to parse initial categories JSON string from environment variable INITIAL_CATEGORIES", e);
    }
}

export default function CategoryFilter({ categoryId = -1 }: Props) {
    // const [categories, setCategories] = useState([{id:-1, name:"All"}]);
    const [categories, setCategories] = useState(initialCategories);
    const getCategories = async () => {
        const { data: categories } = await fetchWordPressJSON<category[]>(`${CUSTOM_API_JSON_URL}/categories-by-recent-post`);
        setCategories([{id:-1, name:"All"}, ...categories]);
    }
    useEffect(() => {getCategories();}, []);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.9;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="max-w-300 w-full mx-auto mb-4 px-4 md:px-6 lg:px-8 mt-6">
            <div className="flex items-center">
                <button
                    onClick={() => scroll("left")}
                    className="p-1 border rounded-full border-accent-subtle text-text-secondary hover:border-accent hover:text-accent transition-all"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-2 overflow-hidden scroll-smooth w-full px-2"
                >
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.id === -1 ? '/' : `/category/${category.id}/1`}
                            className={`
                                px-[14px] py-[6px] text-[13px] rounded-full whitespace-nowrap
                                transition-all duration-180 ease-out cursor-pointer shrink-0
                                ${categoryId === category.id
                                    ? "text-accent-dark bg-accent-subtle"
                                    : "hover:text-text-secondary"
                                }
                            `}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="p-1 border rounded-full border-accent-subtle text-text-secondary hover:border-accent hover:text-accent transition-all"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
