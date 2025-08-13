
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const navItems = [
    { name: 'Events', href: '#events' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Stories', href: '#stories' },
  ];

  const scrollTo = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
        router.push(`/${selector}`)
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  }

  const navigateToRegister = () => {
    router.push('/register');
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="font-headline text-xl font-bold">Passa</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.href);
              }}
              className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={navigateToLogin}>Sign In</Button>
          <Button className="hidden sm:inline-flex" onClick={navigateToRegister}>Register</Button>
        </div>
      </div>
    </header>
  );
};
