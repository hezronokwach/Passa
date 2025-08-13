import Link from 'next/link';
import { Compass, UserCircle2, Ticket, LayoutDashboard } from 'lucide-react';

export const MobileNav = () => {
  const navItems = [
    { name: 'Discover', href: '/dashboard', icon: Compass },
    { name: 'My Tickets', href: '/dashboard/fan/tickets', icon: Ticket },
    { name: 'Dashboard', href: '/dashboard/fan', icon: LayoutDashboard },
    { name: 'Profile', href: '#', icon: UserCircle2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-2 backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
          >
            <item.icon className="size-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
