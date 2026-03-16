"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/articles",    label: "記事",     activePrefix: "/articles" },
  { href: "/charts/race", label: "分析",     activePrefix: "/charts" },
  { href: "/standings",   label: "順位表",   activePrefix: "/standings" },
  { href: "/matches",     label: "試合結果", activePrefix: "/matches" },
  { href: "/players",     label: "Player",   activePrefix: "/players" },
  { href: "/teams",       label: "チーム",   activePrefix: "/teams" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="overflow-x-hidden" style={{ backgroundColor: "#2d0a4e" }}>
      {/* 1行目: ロゴ */}
      <div className="max-w-5xl mx-auto px-4 pt-2 pb-1">
        <Link href="/" aria-label="PremierNow ホームへ">
          <Logo />
        </Link>
      </div>
      {/* 2行目: ナビ */}
      <nav
        className="flex max-w-5xl mx-auto"
        style={{ borderTop: "1px solid #3a2a6a" }}
      >
        {navLinks.map(({ href, label, activePrefix }) => {
          const isActive = pathname.startsWith(activePrefix);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 text-center py-2 text-xs transition-colors font-medium ${
                isActive ? "" : "hover:text-white"
              }`}
              style={
                isActive
                  ? {
                      color: "#00a8e8",
                      borderBottom: "2px solid #00a8e8",
                    }
                  : { color: "#8899cc" }
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
