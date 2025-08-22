'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// NOTE: The background images were not found in the project.
// Using a placeholder image instead.
const libraryBackground = "/the-new-york-public-library-ioPSxCbG3R0-unsplash_1754170453814.jpg";

export function CTASection() {
  return (
    <section 
      className="relative py-20 px-4 text-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${libraryBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 kitenge-pattern opacity-20"></div>
      
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Experience
          <span className="gradient-text block">African Culture?</span>
        </h2>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of culture enthusiasts who have discovered amazing African events through our platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/signup">
            <Button size="lg" className="modern-button text-white px-8 py-4 text-lg">
              Start Your Journey
            </Button>
          </Link>
          
          <Link href="/events">
            <Button 
              variant="outline" 
              size="lg" 
              className="glass-card text-foreground border-white/30 hover:bg-white/20 px-8 py-4 text-lg"
            >
              Browse Events
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
