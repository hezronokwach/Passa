"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Calendar, Ticket, Info, Mail, Home } from "lucide-react";
import { useState, useEffect } from "react";

export const ClientHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "My Tickets", href: "/my-tickets", icon: Ticket },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
        : 'border-b border-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section - Left */}
          <Link href="/" className="flex items-center gap-4 group">
            <Logo className="size-16 text-primary" />
            <span className="font-bold text-3xl tracking-tight text-foreground">
              Passa
            </span>
          </Link>

          {/* Navigation Pills - Center */}
          <nav className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center bg-white/10 backdrop-blur-2xl rounded-full p-2 border border-white/20 shadow-2xl">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 mx-1 text-sm font-medium transition-all duration-300 rounded-full hover:bg-white/10 ${
                      isScrolled ? 'text-primary hover:text-primary' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <IconComponent className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Action Buttons - Right */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>

            <div className="lg:hidden">
              <MobileNav
                isAuthenticated={false}
                dashboardPath="/login"
                navItems={navItems.map(item => ({ name: item.name, href: item.href }))}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
