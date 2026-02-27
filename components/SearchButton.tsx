'use client';

import { Search, X, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchButton() {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    const handleToggle = () => setIsExpanded(!isExpanded);

    const handleSearch = () => {
        const searchTerm = inputRef.current?.value.trim();
        if (!searchTerm) return;
        router.push(`/search/${searchTerm}/1`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative flex items-center">
            {isExpanded ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        onKeyDown={handleKeyDown}
                        className="absolute right-22 px-4 py-2 pr-10 rounded-full border border-accent-subtle bg-transparent backdrop-blur-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-all duration-180 ease-out w-52 md:w-47 md:backdrop-blur-none lg:w-72"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-11 p-2 rounded-full border border-accent-subtle cursor-pointer hover:border-accent hover:text-accent transition-all duration-180 ease-out"
                        aria-label="Search"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleToggle}
                        className="p-2 rounded-full border border-accent-subtle cursor-pointer text-text-secondary hover:border-accent hover:text-accent transition-all duration-180 ease-out"
                        aria-label="Close search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleToggle}
                    className="p-2 rounded-full border border-accent-subtle cursor-pointer text-text-secondary hover:border-accent hover:text-accent transition-all duration-180 ease-out"
                    aria-label="Open search"
                >
                    <Search className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
