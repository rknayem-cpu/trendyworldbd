'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Modern Streetwear Collection',
    subtitle: 'PREMIUM T-SHIRTS & INNERWEAR',
    description: 'Discover high-density graphic tees and comfortable daily essentials built for urban lifestyle.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Shop T-Shirts',
    ctaLink: '/t-shirts',
    badge: 'New Arrival',
  },
  {
    id: 2,
    title: 'Elegance Redefined in Panjabi',
    subtitle: 'FESTIVE & TRADITIONAL',
    description: 'Handcrafted premium Panjabi designs with fine fabric details for every grand occasion.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Explore Panjabi',
    ctaLink: '/panjabi',
    badge: 'Exclusive',
  },
  {
    id: 3,
    title: 'Casual & Formal Executive Shirts',
    subtitle: 'TAILORED PERFECTION',
    description: 'Upgrade your wardrobe with slim-fit cotton shirts designed for work and weekend outings.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'View Shirts',
    ctaLink: '/shirts',
    badge: 'Trending',
  },
  {
    id: 4,
    title: 'Unbeatable Seasonal Clearance',
    subtitle: 'UP TO 50% OFF ON ALL ITEMS',
    description: 'Don\'t miss out on our limited-time discounts across all innerwear, tees, and combos.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Grab Offers',
    ctaLink: '/offers',
    badge: 'Hot Deal',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[550px] max-h-[750px] bg-neutral-950 overflow-hidden pt-20">
      
      {/* Slides Container */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-neutral-950">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl space-y-5 animate-in slide-in-from-left duration-700">
                
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </span>

                {/* Subtitle */}
                <p className="text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase">
                  {slide.subtitle}
                </p>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-wide">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
                  {slide.description}
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-xl hover:shadow-rose-500/25 hover:scale-105 transition-all duration-200"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {slide.ctaText}
                  </Link>
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md transition-all hidden sm:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md transition-all hidden sm:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-gradient-to-r from-rose-500 to-amber-500'
                : 'w-2.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </section>
  );
}