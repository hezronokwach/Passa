
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const DURATION = 3000;
const PARTICLE_COUNT = 50;

const ConfettiParticle = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const colors = ['#6B46C1', '#F0B400', '#FFFFFF', '#E9D5FF'];
    const color = colors[Math.floor(random(0, colors.length))];

    const x = random(-150, 150); // increased range for wider spread
    const y = random(-150, 150); // increased range for wider spread
    const rotation = random(0, 360);
    const scale = random(0.5, 1.2);
    const delay = random(0, DURATION * 0.1);
    const duration = random(DURATION * 0.7, DURATION);

    setStyle({
      backgroundColor: color,
      '--x': `${x}vw`,
      '--y': `${y}vh`,
      '--rotation-start': `${random(-360, 360)}deg`,
      '--rotation-end': `${random(-360, 360)}deg`,
      '--scale': scale,
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
    });
  }, []);

  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 h-2 w-2 opacity-0 animate-confetti-fall rounded-full'
      )}
      style={style}
    />
  );
};

export const Confetti = ({ active }: { active: boolean }) => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (active) {
      setRender(true);
      const timer = setTimeout(() => setRender(false), DURATION);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!render) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <ConfettiParticle key={i} id={i} />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate3d(0, 0, 0) rotate(var(--rotation-start)) scale(0); opacity: 1; }
          100% { transform: translate3d(var(--x), var(--y), 0) rotate(var(--rotation-end)) scale(var(--scale)); opacity: 0; }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};
