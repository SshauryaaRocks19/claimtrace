"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
}

const GooeyNav = ({ items = [] }: GooeyNavProps) => {
  const pathname = usePathname();
  const initialIndex = items.findIndex((item) => item.href === pathname);
  const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sync active state when pathname changes
  useEffect(() => {
    const currentIndex = items.findIndex((item) => item.href === pathname);
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, items]);

  return (
    <nav className="relative flex items-center gap-2 px-4" onMouseLeave={() => setHoveredIndex(null)}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={item.label}
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => setActiveIndex(index)}
          >
            <Link 
              href={item.href}
              className={`relative z-10 block px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-background' : 'text-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>

            {/* Hover Indicator Background */}
            {isHovered && !isActive && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 bg-muted/50 rounded-full z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Active Pill Background */}
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 bg-foreground rounded-full z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default GooeyNav;
