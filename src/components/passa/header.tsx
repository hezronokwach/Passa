"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions/auth';
import { MobileNav } from './mobile-nav';
import { useActionState, useState, useEffect } from 'react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const [state, formAction] = useActionState(logout, { success: false, message: '' });
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  // TODO: Replace with actual session context when available
  const isAuthenticated = false;
  const userRole = null;

  const navItems = [
    { name: 'Events', href: '/events' },
    { name: 'My tickets', href: '/my-tickets'},
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ];

  const dashboardPath = userRole ? `/dashboard/${userRole.toLowerCase()}` : '/login';

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${isScrolled ? 'border-b bg-background/80 backdrop-blur-sm' : 'border-transparent'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="font-headline text-xl font-bold">Passa</span>
        </Link>
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href={dashboardPath}>Dashboard</Link>
                </Button>
                <form action={formAction}>
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
          <MobileNav isAuthenticated={isAuthenticated} dashboardPath={dashboardPath} navItems={navItems} />
        </div>
      </div>
    </header>
  );
};