'use client';

import { motion } from "framer-motion";
import { UserGroupIcon, CalendarDaysIcon, SparklesIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// NOTE: The background images were not found in the project.
// Using a placeholder image instead.
const musicBackground = "/annie-cotnoir-tZUme5txQCM-unsplash_1754170453812.jpg";
const artBackground = "/birmingham-museums-trust-8FNuCxFfbFw-unsplash_1754170453812.jpg";
const danceBackground = "/heather-green-8W_ilNg5IJ8-unsplash_1754170453811.jpg";
const festivalBackground = "/patrick-mueller-SBbCQJYzmKU-unsplash_1754170453813.jpg";

export function FeaturesSection() {
  const features = [
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Multi-Role Platform",
      description: "Artists, Event Planners, Hosts, and Attendees - all in one seamless ecosystem",
      background: musicBackground
    },
    {
      icon: <CreditCardIcon className="w-8 h-8" />,
      title: "Stellar Payments",
      description: "Fast, secure, and low-cost payments powered by Stellar blockchain technology",
      background: artBackground
    },
    {
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      title: "Smart Booking",
      description: "Intelligent seat selection, QR code tickets, and real-time availability updates",
      background: danceBackground
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Cultural Discovery",
      description: "Explore authentic African music, dance, art, and traditional ceremonies",
      background: festivalBackground
    }
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Why Choose <span className="gradient-text">Passa</span>?
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the future of event booking with our revolutionary platform that celebrates African culture
          while leveraging cutting-edge blockchain technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
          >
            <Card
              className="glass-card h-full relative overflow-hidden group cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${feature.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-kitenge-orange to-kitenge-red rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-white/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
