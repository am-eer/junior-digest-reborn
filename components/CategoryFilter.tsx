"use client";

import { API_JSON_URL } from "@/lib/globals";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface categoryName {
    name: string
}

export default function CategoryFilter() {
    const [categories, setCategories] = useState(["All", "Accident", "Agriculture", "Art", "Automobile", "Banking", "Business", "Cinema", "commerce", "Corporate news", "court", "Cricket", "Crime", "Culture", "Defence", "Deplomacy", "Development", "Disaster", "Economics", "Education", "Entertainment", "Enviornment", "Essay", "Feature", "Finance", "General issues", "Health", "History", "Human rights", "Human story", "I T", "International", "Law", "Literature", "Medical", "Nature", "news", "news India", "news World", "Obituary", "Policy", "Politics", "Psychology", "Relegion", "School Arts Festival", "science", "Social Issues", "Space", "Sports", "Technology"]);
    const getCategoryNames = async () => {
        const response = await fetch(`${API_JSON_URL}/categories?_fields=name&per_page=100`);
        const categoryNames = await response.json() as categoryName[];
        setCategories(["All", ...categoryNames.map(e => e.name)]);
    }
    useEffect(() => {
        getCategoryNames();
    }, []);
    const [activeCategory, setActiveCategory] = useState("All");
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
        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-6 lg:px-8 mt-6">
            <div className="flex items-center">
                <button
                    onClick={() => scroll("left")}
                    className="p-1 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-sm hover:bg-accent/10 transition-all"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-2 overflow-hidden scroll-smooth w-full px-2"
                >
                    {categories.map((category, index) => (
                        <button
                            key={`${category}-${index}`}
                            onClick={() => setActiveCategory(category)}
                            className={`
                                px-[14px] py-[6px] text-[13px] rounded-full border whitespace-nowrap
                                transition-all duration-180 ease-out cursor-pointer shrink-0
                                ${activeCategory === category
                                    ? "border-accent text-accent"
                                    : "border-border-subtle hover:border-accent/50 hover:text-accent/80"
                                }
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="p-1 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-sm hover:bg-accent/10 transition-all"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
