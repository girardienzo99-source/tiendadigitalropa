import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingCart, User, Calendar, AlertCircle, Check } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailsModalProps {
  product: Product;
  currencySymbol: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  onAddReview: (productId: string, rating: number, userName: string, comment: string) => void;
}

export default function ProductDetailsModal({
  product,
  currencySymbol,
  isOpen,
  onClose,
  onAddToCart,
  onAddReview
}: ProductDetailsModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [cartError, setCartError] = useState('');
  const [cartSuccess, setCartSuccess] = useState(false);

  // Review Form States
  const [formRating, setFormRating] = useState<number>(5);
  const [formName, setFormName] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!isOpen) return null;

  const hasDiscount = product.promoPrice && product.promoPrice < product.price;
  const activePrice = hasDiscount ? product.promoPrice! : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.promoPrice!) / product.price) * 100) : 0;

  const totalReviews = product.reviews ? product.reviews.length : 0;
  const avgRating = totalReviews > 0
    ? parseFloat((product.reviews!.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const handleAddToCartClick = () => {
    if (product.stock === 0) return;
    if (!selectedSize) {
      setCartError('Seleccioná un talle');
      setTimeout(() => setCartError(''), 2500);
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Por favor, ingresá tu nombre.');
      return;
    }
    if (!formComment.trim()) {
      setFormError('Por favor, ingresá un comentario.');
      return;
    }
    if (formRating < 1 || formRating > 5) {
      setFormError('Por favor, seleccioná una calificación válida.');
      return;
    }

    onAddReview(product.id, formRating, formName.trim(), formComment.trim());
    
    // Reset Form
    setFormName('');
    setFormComment('');
    setFormRating(5);
    setFormError('');
  };

  const ratingTexts: { [key: number]: string } = {
    1: 'Malo 😡',
    2: 'Regular 😕',
    3: 'Bueno 🙂',
    4: 'Muy Bueno 😀',
    5: '¡Excelente! 😍'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Background click handler */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl bg-[#0F0F0F] rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white border border-white/5 hover:border-white/20 transition-all cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Media & Info summary */}
            <div className="p-6 sm:p-8 bg-[#090909] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
              <div>
                <div className="relative pt-[100%] rounded-2xl overflow-hidden bg-black/30 border border-white/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs font-black bg-orange-600 text-white tracking-widest uppercase shadow-md z-10">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl text-[10px] font-black bg-red-600/30 text-red-400 border border-red-500/30 uppercase tracking-widest backdrop-blur-md z-10">
                      Últimas {product.stock} unidades
                    </span>
                  )}
                </div>

                {/* Rating average big display */}
                <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest block">Calificación Promedio</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl font-mono font-black text-white">{avgRating > 0 ? avgRating : '0.0'}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={16}
                            className={idx < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white/60 font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    {totalReviews} {totalReviews === 1 ? 'Reseña' : 'Reseñas'}
                  </span>
                </div>
              </div>

              {/* Quick specifications / Category list */}
              <div className="mt-8 space-y-3.5 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Categoría</span>
                  <span className="font-extrabold text-orange-500 uppercase tracking-wider">{product.category}</span>
                </div>
                {product.subcategory && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Subcategoría</span>
                    <span className="font-bold text-white/80 uppercase">{product.subcategory}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">ID de Producto</span>
                  <span className="font-mono text-white/30">#{product.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Disponibilidad</span>
                  <span className={`font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `En Stock (${product.stock} disp.)` : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Customizers, Cart Add, and interactive reviews list/form */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Product Info Heading */}
              <div className="space-y-1.5">
                <h2 className="font-sans font-black text-xl sm:text-2xl text-white uppercase tracking-tight leading-tight">
                  {product.name}
                </h2>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 pt-1">
                  <span className="text-2xl font-mono font-black text-white tracking-tight">
                    {currencySymbol}{activePrice.toLocaleString('es-AR')}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-white/30 line-through font-mono">
                      {currencySymbol}{product.price.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/30 block">Descripción:</span>
                <p className="text-xs text-white/70 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Interactive Purchase Controls (only if in stock) */}
              {product.stock > 0 ? (
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                  {/* Color selector if exists */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block">Color Seleccionado:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              selectedColor === color
                                ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Talle / Medida:</label>
                      {cartError && (
                        <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1 animate-bounce">
                          <AlertCircle size={10} />
                          {cartError}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105'
                              : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add action */}
                  <button
                    onClick={handleAddToCartClick}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      cartSuccess
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/10'
                        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/10'
                    }`}
                  >
                    {cartSuccess ? (
                      <>
                        <Check size={14} />
                        ¡Agregado con éxito!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        Agregar al Carrito
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-red-600/5 border border-red-500/25 rounded-2xl flex items-center gap-2.5 text-xs text-red-400 font-bold">
                  <AlertCircle size={15} />
                  <span>Este producto se encuentra temporalmente agotado.</span>
                </div>
              )}

              {/* Reviews & Feedback Tab Section */}
              <div className="border-t border-white/10 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-black text-sm uppercase tracking-wider text-white">
                    Opiniones y Reseñas
                  </h3>
                  <span className="text-[10px] font-mono text-white/40">({totalReviews} comentarios)</span>
                </div>

                {/* Submit review Form */}
                <form onSubmit={handleReviewSubmit} className="p-4 bg-[#141414] rounded-2xl border border-white/5 space-y-3.5">
                  <h4 className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Dejanos tu Opinión ✍️</h4>
                  
                  {formError && (
                    <div className="p-2 bg-red-600/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Interactive Stars Selector */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-white/40 uppercase block">Calificación:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const isLit = hoverRating !== null ? starValue <= hoverRating : starValue <= formRating;
                          return (
                            <button
                              type="button"
                              key={starValue}
                              onClick={() => setFormRating(starValue)}
                              onMouseEnter={() => setHoverRating(starValue)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="text-white/20 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                size={18}
                                className={isLit ? 'fill-amber-400 text-amber-400' : 'text-white/25'}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[11px] font-bold text-white/80 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono">
                        {ratingTexts[hoverRating || formRating]}
                      </span>
                    </div>
                  </div>

                  {/* Name and Comment Inputs */}
                  <div className="grid grid-cols-1 gap-2.5">
                    <div>
                      <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">Nombre Completo:</span>
                      <input
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full p-2 bg-[#090909] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 transition-colors font-medium placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">Tu Comentario:</span>
                      <textarea
                        rows={2.5}
                        placeholder="Contanos tu experiencia con el talle, la tela, o la comodidad..."
                        value={formComment}
                        onChange={(e) => setFormComment(e.target.value)}
                        className="w-full p-2 bg-[#090909] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 transition-colors font-medium placeholder:text-white/20 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Enviar Reseña 💾
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/30 block">Opiniones de otros compradores:</span>
                  
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1.5 custom-scrollbar">
                      {product.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3 bg-[#111111] rounded-xl border border-white/5 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/60">
                                <User size={11} />
                              </div>
                              <span className="text-[11px] font-bold text-white/95 leading-none block">{rev.userName}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={9}
                                    className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-medium text-white/30 font-mono flex items-center gap-1">
                                <Calendar size={10} />
                                {rev.createdAt}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-white/60 pl-8 leading-relaxed font-medium">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-[#111111] rounded-xl border border-white/5 space-y-1">
                      <span className="text-xl block">⭐️</span>
                      <p className="text-[11px] text-white/40 font-semibold uppercase">No hay calificaciones para este producto</p>
                      <p className="text-[10px] text-white/20">¡Sé el primero en dejar una opinión completando el formulario de arriba!</p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
