"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions/auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserCircle2, LayoutDashboard, User } from 'lucide-react';
import { useActionState, useState, useEffect } from 'react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const [state, formAction] = useActionState(logout, undefined);
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        window.location.href = '/login';
      }
    }
  }, [state, toast]);

  const isAuthenticated = !!session;
  const userRole = session?.role;

  const navItems = [
    { name: 'Events', href: '/events' },
    { name: 'My tickets', href: '/my-tickets'},
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ];

  const dashboardPath = userRole ? `/dashboard/${userRole.toLowerCase()}` : '/login';

  // Get user's name for display
  let userName = 'User';
  if (session?.name) {
    userName = session.name.split(' ')[0];
  } else if (session?.email) {
    userName = session.email.split('@')[0];
  }

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle2 className="size-5" />
                    <span className="hidden md:inline">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPath} className="flex items-center gap-2">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`${dashboardPath}/profile`} className="flex items-center gap-2">
                      <User className="size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <form action={formAction}>
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-0 pl-2 hover:bg-transparent"
                        type="submit"
                      >
                        Sign Out
                      </Button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
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

        </div>
      </div>
    </header>
  );
};
