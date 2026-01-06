import Link from "next/link";

const itemStyle = "px-4 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900";

export default function Navbar() {
    return (
        <nav className="mt-4 flex gap-8 justify-center text-lg">
         <Link href="/" className={itemStyle}>Home</Link>
         <div className={itemStyle}>Categories</div>
         <Link href="/about" className={itemStyle}>About</Link>
         <Link href="/contact" className={itemStyle}>Contact</Link>
      </nav>
    );
}