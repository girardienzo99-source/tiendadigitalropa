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
    <div id="promo-banner-slider" className="relative w-full h-[280px] md:h-[400px] overflow-hidden rounded-3xl bg-[#09090B] border border-white/5 shadow-2xl mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Overlay Background - Rich dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
          
          {/* Slow panning Ken burns image effect */}
          <motion.img
            key={`img-${current.id}`}
            src={current.image}
            alt={current.title}
            initial={{ scale: 1.05, x: -10 }}
            animate={{ scale: 1.15, x: 10 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          {/* Banner Content with staggered animations */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center items-start px-8 md:px-20 z-20 max-w-xl text-white">
            {current.discountText && (
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-black bg-orange-600 text-white uppercase tracking-widest mb-4 shadow-lg border border-orange-500/20 shadow-orange-600/10"
              >
                {current.discountText.includes('ENVÍO') ? <Truck size={12} /> : <Tag size={12} />}
                {current.discountText}
              </motion.span>
            )}
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-3xl md:text-5xl font-black tracking-tight mb-3 uppercase italic leading-none text-metallic"
            >
              {current.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-xs md:text-sm text-white/70 mb-7 leading-relaxed font-medium max-w-md"
            >
              {current.subtitle}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              onClick={() => current.linkToCategory && onCategorySelect(current.linkToCategory)}
              className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-extrabold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Explorar Colección
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/85 text-white/70 hover:text-white border border-white/5 hover:border-white/20 z-30 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            aria-label="Anterior publicidad"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/85 text-white/70 hover:text-white border border-white/5 hover:border-white/20 z-30 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            aria-label="Siguiente publicidad"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
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
