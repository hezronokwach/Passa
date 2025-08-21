import Link from 'next/link';
import { Compass, UserCircle2, Ticket, LayoutDashboard, Star } from 'lucide-react';
import { getSession } from '@/lib/session';

export const MobileNav = async () => {
  const session = await getSession();
  const userRole = session?.role;

  const defaultNavItems = [
    { name: 'Discover', href: '/dashboard', icon: Compass },
    { name: 'Tickets', href: '/dashboard/fan/tickets', icon: Ticket },
    { name: 'Artists', href: '/dashboard/fan/artists', icon: Star },
    { name: 'Profile', href: '/dashboard/fan/profile', icon: UserCircle2 },
  ];

  // Adjust navigation based on user role if needed
  const navItems = defaultNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 p-2 backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
          >
            <item.icon className="size-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
