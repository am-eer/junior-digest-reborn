"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseStyle = "px-3 py-1.5 text-meta transition-opacity duration-[180ms] ease-out hover:opacity-70";
const activeStyle = "border-b-2 border-accent text-accent";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/team", label: "Team" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <nav className="mt-4 flex gap-2 justify-start max-w-[1200px] w-full mx-auto px-4 md:px-6 lg:px-8">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`${baseStyle} ${pathname === link.href ? activeStyle : ""}`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}