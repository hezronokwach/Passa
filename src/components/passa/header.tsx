import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions/auth';
import { MobileNav } from './mobile-nav';
import { NotificationBell } from './notifications';

export const Header = async () => {
  const session = await getSession();
  const isAuthenticated = !!session;
  const userRole = session?.role as string | undefined;

  const navItems = [
    { name: 'Events', href: '/events' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ];

  const dashboardPath = userRole ? `/dashboard/${userRole.toLowerCase()}` : '/login';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
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
          <NotificationBell />
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href={dashboardPath}>Dashboard</Link>
                </Button>
                <form action={logout}>
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