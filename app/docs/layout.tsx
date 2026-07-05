"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, BrainCircuit, Lightbulb, PlayCircle, Database } from "lucide-react";

const sidebarLinks = [
  { title: "Introduction", href: "/docs", icon: BookOpen },
  { title: "The Memory Advantage", href: "/docs/memory", icon: BrainCircuit },
  { title: "Use Cases", href: "/docs/use-cases", icon: Lightbulb },
  { title: "Demo Workflow", href: "/docs/workflow", icon: PlayCircle },
  { title: "The Dataset", href: "/docs/dataset", icon: Database },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pt-24 max-w-7xl mx-auto">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 p-6 md:border-r border-border/50 md:sticky md:top-24 md:h-[calc(100vh-6rem)] overflow-y-auto">
        <h2 className="text-lg font-bold mb-6 text-foreground tracking-tight">Documentation</h2>
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-16">
        <div className="max-w-3xl prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-li:text-muted-foreground">
          {children}
        </div>
      </main>
    </div>
  );
}
