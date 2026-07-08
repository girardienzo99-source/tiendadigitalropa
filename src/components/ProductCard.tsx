import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, RefreshCw, AlertCircle, Sparkles, Star, Ruler } from 'lucide-react';
import { Product } from '../types';
import SizeGuideModal from './SizeGuideModal';

interface ProductCardProps {
  key?: string;
  product: Product;
  currencySymbol: string;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({ product, currencySymbol, onAddToCart, onViewDetails }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const [isLiked, setIsLiked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const hasDiscount = product.promoPrice && product.promoPrice < product.price;
  const activePrice = hasDiscount ? product.promoPrice! : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.promoPrice!) / product.price) * 100) : 0;

  const totalReviews = product.reviews ? product.reviews.length : 0;
  const avgRating = totalReviews > 0
    ? parseFloat((product.reviews!.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const handleAdd = () => {
    if (product.stock === 0) return;
    if (!selectedSize) {
      setErrorMessage('Seleccioná un talle');
      setTimeout(() => setErrorMessage(''), 2500);
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    // Reset selected size to encourage further additions
    setSelectedSize('');
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col h-full rounded-2xl bg-[#111111] border border-white/5 hover:border-white/15 shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-orange-600 text-white tracking-widest uppercase shadow-md">
            -{discountPercent}% OFF
          </span>
        )}
        {product.tags?.map((tag, idx) => (
          <span
            key={idx}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-md ${
              tag.toLowerCase().includes('más vendido') || tag.toLowerCase().includes('hot')
                ? 'bg-orange-600 text-white'
                : 'bg-white text-black'
            }`}
          >
            {tag}
          </span>
        ))}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
            ¡Últimos {product.stock} disp!
          </span>
        )}
        {product.stock === 0 && (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white/10 text-white/40 border border-white/5 uppercase tracking-widest">
            Sin Stock
          </span>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white/60 hover:text-rose-500 backdrop-blur-md shadow-md transition-all cursor-pointer"
        aria-label="Agregar a favoritos"
      >
        <Heart size={18} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
      </button>

      {/* Product Image */}
      <div 
        onClick={() => onViewDetails?.(product)}
        className="relative pt-[100%] bg-[#080808] overflow-hidden group cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3.5 py-1.5 bg-black/80 rounded-xl font-bold text-[10px] text-white uppercase tracking-widest border border-white/10 shadow-lg">
            Ver Detalles 🔍
          </span>
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 rounded-full font-black text-white/40 border-2 border-white/20 uppercase tracking-widest text-xs bg-black/80">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Badge */}
        <div className="flex items-center justify-between text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">
          <span>{product.category}{product.subcategory && ` › ${product.subcategory}`}</span>
          <span className="font-mono text-white/20">#{product.id}</span>
        </div>

        {/* Rating Stars line */}
        <div 
          onClick={() => onViewDetails?.(product)}
          className="flex items-center gap-1.5 mb-2 cursor-pointer group/rating"
        >
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={11}
                className={index < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-white/40 font-mono group-hover/rating:text-amber-400 transition-colors">
            {totalReviews > 0 ? `${avgRating} (${totalReviews})` : 'Sin reseñas'}
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails?.(product)}
          className="font-sans font-black text-base text-white tracking-tight line-clamp-1 hover:text-orange-500 transition-colors mb-1.5 uppercase italic cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/50 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Pricing Area */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-mono tracking-tight font-black text-white">
            {currencySymbol}
            {activePrice.toLocaleString('es-AR')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-white/30 line-through font-mono">
              {currencySymbol}
              {product.price.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {/* Color Selection if multiple colors exist */}
        {product.colors && product.colors.length > 1 && (
          <div className="mb-4">
            <label className="text-[10px] uppercase font-black tracking-widest text-white/30 block mb-1.5">Color:</label>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-none shadow-md shadow-orange-600/15'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection Row */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-white/30 flex items-center gap-1">
              Talle/Medida:
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer text-[9px] font-bold underline flex items-center gap-0.5 ml-2"
              >
                <Ruler size={10} />
                Guía
              </button>
              {product.stock > 0 && (
                <span className="text-[9px] text-emerald-400 font-extrabold ml-2">
                  ({product.stock} disp.)
                </span>
              )}
            </span>
            {errorMessage && (
              <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1 animate-bounce">
                <AlertCircle size={10} />
                {errorMessage}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                disabled={product.stock === 0}
                onClick={() => setSelectedSize(size)}
                className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedSize === size
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-none shadow-lg shadow-orange-600/15 scale-105'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 active:scale-95'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
            product.stock === 0
              ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-98 text-white shadow-lg shadow-orange-600/20 border-none'
          }`}
        >
          <ShoppingCart size={14} />
          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </motion.div>
  );
}
