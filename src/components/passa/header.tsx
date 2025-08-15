"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { logout } from "@/app/actions/auth";
import { MobileNav } from "./mobile-nav";
import { useEffect, useState } from "react";

interface SessionData {
  authenticated: boolean;
  userId: number | null;
  role: string | null;
}

export const Header = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (active) setSession({ authenticated: false, userId: null, role: null });
          return;
        }

        const json = await res.json().catch(() => null);

        if (active) {
          setSession({
            authenticated: json?.authenticated ?? false,
            userId: json?.userId ?? null,
            role: json?.role ?? null
          });
        }
      } catch {
        if (active) setSession({ authenticated: false, userId: null, role: null });
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const navItems = [
    { name: "Events", href: "/events" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
  ];

  const dashboardPath =
    session?.role ? `/dashboard/${session.role.toLowerCase()}` : "/login";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="font-headline text-xl font-bold">Passa</span>
        </Link>

        {/* Main nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop auth controls */}
          <div className="hidden sm:flex items-center gap-2">
            {loading ? (
              <div className="w-24 h-8" />
            ) : session?.authenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href={dashboardPath}>Dashboard</Link>
                </Button>
                <form action={ 
                  async() => {
                    await logout();
                  }
                }>
                  <Button variant="outline" type="submit">
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile nav (with dropdown-like behavior) */}
          <MobileNav
            isAuthenticated={!!session?.authenticated}
            dashboardPath={dashboardPath}
            navItems={navItems}
          />
        </div>
      </div>
    </header>
  );
};
