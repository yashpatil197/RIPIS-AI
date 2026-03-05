/**
 * Navbar - Shared navigation bar across all pages
 * Premium dark glassmorphism with smooth transitions
 */

import Link from "next/link";
import { useRouter } from "next/router";

const NAV_LINKS = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/mock", label: "Mock Interview", icon: "🎯" },
    { href: "/ai-interview", label: "AI Interviewer", icon: "🤖" },
];

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50"
            style={{ background: "rgba(10, 10, 10, 0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/">
                        <span className="flex items-center gap-2 cursor-pointer group">
                            <span className="text-lg font-bold tracking-tight text-white group-hover:opacity-80 transition">
                                RIPIS
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                                AI
                            </span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        {NAV_LINKS.map(({ href, label, icon }) => {
                            const isActive = router.pathname === href;
                            return (
                                <Link key={href} href={href}>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${isActive
                                            ? "text-white"
                                            : "text-gray-500 hover:text-gray-300"
                                        }`}
                                        style={isActive ? { background: "rgba(99,102,241,0.12)", color: "#a5b4fc" } : {}}>
                                        <span className="text-xs">{icon}</span>
                                        <span className="hidden md:inline">{label}</span>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
