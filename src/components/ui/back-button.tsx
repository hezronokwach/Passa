'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  children: React.ReactNode;
  className?: string;
  fallbackHref?: string;
}

export function BackButton({ children, className, fallbackHref = '/' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </button>
  );
}