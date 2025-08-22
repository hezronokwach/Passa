import Link from 'next/link';
import { Compass, UserCircle2, Ticket, Star, Calendar, Users, Briefcase, PlusCircle } from 'lucide-react';

interface MobileNavProps {
  userRole?: string;
}

export const MobileNav = ({ userRole }: MobileNavProps) => {
  // Don't show mobile nav if user role is not provided
  if (!userRole) {
    return null;
  }

  const getNavItems = () => {
    switch (userRole) {
      case 'FAN':
        return [
          { name: 'Dashboard', href: '/dashboard/fan', icon: Compass },
          { name: 'Tickets', href: '/dashboard/fan/tickets', icon: Ticket },
          { name: 'Artists', href: '/dashboard/fan/artists', icon: Star },
          { name: 'Profile', href: '/dashboard/fan/profile', icon: UserCircle2 },
        ];
      case 'ORGANIZER':
        return [
          { name: 'Dashboard', href: '/dashboard/organizer', icon: Compass },
          { name: 'Events', href: '/dashboard/organizer/events', icon: Calendar },
          { name: 'Create', href: '/dashboard/organizer/events/create', icon: PlusCircle },
          { name: 'Profile', href: '/dashboard/organizer/profile', icon: UserCircle2 },
        ];
      case 'CREATOR':
        return [
          { name: 'Dashboard', href: '/dashboard/creator', icon: Compass },
          { name: 'Opportunities', href: '/dashboard/creator/opportunities', icon: Briefcase },
          { name: 'Applications', href: '/dashboard/creator/applications', icon: Users },
          { name: 'Profile', href: '/dashboard/creator/profile', icon: UserCircle2 },
        ];
      default:
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Compass },
          { name: 'Events', href: '/events', icon: Calendar },
          { name: 'Profile', href: '/dashboard/fan/profile', icon: UserCircle2 },
        ];
    }
  };

  const navItems = getNavItems();

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