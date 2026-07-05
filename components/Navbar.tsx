"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import GooeyNav from "@/components/ui/GooeyNav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/queue" },
    { label: "Graph Network", href: "/network" },
    { label: "Submit Claim", href: "/claims/new" },
    { label: "Documentation", href: "/docs" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 isolate bg-background border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-foreground tracking-tight">
          ClaimTrace
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <GooeyNav items={navLinks} />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile Menu Toggle */}
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full px-4 pb-4">
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border p-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
