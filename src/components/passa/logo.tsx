
import Image from 'next/image';

export const Logo = ({ className }: { className?: string }) => (
  <Image
    src="/logo.png"
    alt="Passa Logo"
    width={100}
    height={100}
    className={className}
    priority
  />
);
