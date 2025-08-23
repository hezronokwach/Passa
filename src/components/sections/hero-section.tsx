'use client';

import { motion } from "framer-motion";
import { PlayIcon, UserGroupIcon, CalendarDaysIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const culturalBackground = "/sijmen-van-hooff-E0yS34zGQRY-unsplash_1754170453807.jpg";

interface HeroSectionProps {
  onWatchVideo: () => void;
}

export function HeroSection({ onWatchVideo }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${culturalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 kitenge-pattern opacity-10"></div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Experience
          <span className="gradient-text block">African Culture</span>
          Like Never Before
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Discover <span className="gradient-text">authentic African cultural events</span>, from traditional music festivals to art exhibitions. 
          Powered by <span className="text-primary">Stellar blockchain</span> for secure, instant payments.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Button size="lg" className="modern-button text-white px-8 py-4 text-lg">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Explore Events
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onWatchVideo}
            className="glass-card text-foreground border-white/30 hover:bg-white/20 px-8 py-4 text-lg"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            Watch Story
          </Button>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Badge variant="secondary" className="glass-card text-white px-4 py-2">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            10,000+ Happy Attendees
          </Badge>
          <Badge variant="secondary" className="glass-card text-white px-4 py-2">
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            500+ Cultural Events
          </Badge>
          <Badge variant="secondary" className="glass-card text-white px-4 py-2">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Blockchain Secured
          </Badge>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
}
