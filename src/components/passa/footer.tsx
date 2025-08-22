'use client';

import { FaGithub, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { AnimatedLogo } from "@/components/animated-logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass-nav border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <AnimatedLogo className="w-12 h-12" />
              <span className="text-2xl font-bold gradient-text">Passa</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting African culture with the world through immersive experiences
              and cutting-edge blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaLinkedinIn className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events" className="hover:text-foreground transition-colors">Browse Events</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/auth/artist-signup" className="hover:text-foreground transition-colors">Join as Artist</Link></li>
              <li><Link href="/auth/planner-signup" className="hover:text-foreground transition-colors">Event Planning</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Passa. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for African culture
          </p>
        </div>
      </div>
    </footer>
  );
}
