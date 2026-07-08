import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Tag, Truck } from 'lucide-react';
import { PromoBanner } from '../types';

interface PromoSliderProps {
  banners: PromoBanner[];
  onCategorySelect: (category: 'zapatillas' | 'ropa' | 'accesorios' | 'all') => void;
}

export default function PromoSlider({ banners, onCategorySelect }: PromoSliderProps) {
  const activeBanners = banners.filter(b => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const current = activeBanners[currentIndex];

  return (
    <div id="promo-banner-slider" className="relative w-full h-[280px] md:h-[380px] overflow-hidden rounded-2xl bg-neutral-900 shadow-lg mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Overlay Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
          
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-center scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Banner Content */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center items-start px-6 md:px-16 z-20 max-w-xl text-white">
            {current.discountText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-orange-600 text-white uppercase tracking-widest mb-4 shadow-md animate-pulse">
                {current.discountText.includes('ENVÍO') ? <Truck size={12} /> : <Tag size={12} />}
                {current.discountText}
              </span>
            )}
            
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2 uppercase italic drop-shadow-md">
              {current.title}
            </h2>
            
            <p className="text-sm md:text-base text-white/80 mb-6 drop-shadow">
              {current.subtitle}
            </p>

            <button
              onClick={() => current.linkToCategory && onCategorySelect(current.linkToCategory)}
              className="px-6 py-3 rounded-lg bg-orange-600 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-500 active:scale-95 transition-all shadow-lg shadow-orange-600/25 cursor-pointer"
            >
              Explorar Colección
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white z-30 backdrop-blur-xs active:scale-90 transition-all"
            aria-label="Anterior publicidad"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white z-30 backdrop-blur-xs active:scale-90 transition-all"
            aria-label="Siguiente publicidad"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-white' : 'bg-white/40'
                }`}
                aria-label={`Ir al banner ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
