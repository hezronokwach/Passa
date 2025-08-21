import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { logout } from '@/app/actions/auth';

type NavItem = {
  name: string;
  href: string;
};

type MobileNavProps = {
  isAuthenticated: boolean;
  dashboardPath: string;
  navItems: NavItem[];
};

export const MobileNav = ({ isAuthenticated, dashboardPath, navItems }: MobileNavProps) => {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-2 py-1 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t pt-4 mt-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardPath}
                  className="block px-2 py-1 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground mb-2"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <Button variant="outline" type="submit" className="w-full">
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
