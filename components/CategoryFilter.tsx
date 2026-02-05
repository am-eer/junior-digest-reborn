"use client";

import { useState } from "react";

const categories = [
    "All",
    "Technology",
    "Science",
    "Business",
    "Entertainment",
    "Sports",
    "Health",
    "Arts",
    "Agriculture",
    "Automobile",
    "Crime",
    "Legal",
    "Disaster"
];

export default function CategoryFilter() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-6 lg:px-8 mt-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`
                            px-[14px] py-[6px] text-[13px] rounded-full border whitespace-nowrap
                            transition-all duration-180 ease-out cursor-pointer
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
        </div>
    );
}
