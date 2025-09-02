'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export function MyTicketsLink() {
  const [session, setSession] = useState<{ userId: number; role: string; } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (session) {
      router.push('/dashboard/fan/tickets');
    } else {
      router.push('/login');
    }
  };

  return (
    <Link href="/my-tickets" onClick={handleClick} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
      My Tickets
    </Link>
  );
}
