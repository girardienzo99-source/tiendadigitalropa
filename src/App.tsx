import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, Search, Settings, Store, ArrowRight, Heart,
  Phone, Sparkles, MapPin, CheckCircle, Info, ChevronRight, X, AlertCircle
} from 'lucide-react';

import { Product, PromoBanner, StoreSettings, CartItem, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_SETTINGS } from './data';

import PromoSlider from './components/PromoSlider';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import MercadoPagoModal from './components/MercadoPagoModal';
import AdminPanel from './components/AdminPanel';
import ProductDetailsModal from './components/ProductDetailsModal';
import { supabase } from './supabaseClient';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Persistent States ---
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<PromoBanner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zap_store_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Fetch initial data from Supabase ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch Products
        const { data: dbProducts, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (!prodError && dbProducts && dbProducts.length > 0) {
          const mappedProducts = dbProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
            category: p.category,
            subcategory: p.subcategory || undefined,
            image: p.image,
            stock: Number(p.stock),
            sizes: p.sizes,
            colors: p.colors || [],
            featured: p.featured || false,
            tags: p.tags || [],
            reviews: p.reviews || []
          }));
          setProducts(mappedProducts);
        }

        // 2. Fetch Banners
        const { data: dbBanners, error: bannerError } = await supabase
          .from('banners')
          .select('*')
          .order('title');
          
        if (!bannerError && dbBanners && dbBanners.length > 0) {
          const mappedBanners = dbBanners.map((b: any) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            image: b.image,
            linkToCategory: b.link_to_category,
            discountText: b.discount_text || undefined,
            active: b.active
          }));
          setBanners(mappedBanners);
        }

        // 3. Fetch Settings
        const { data: dbSettings, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (!settingsError && dbSettings) {
          const mappedSettings = {
            storeName: dbSettings.store_name,
            whatsappNumber: dbSettings.whatsapp_number,
            currencySymbol: dbSettings.currency_symbol,
            mercadoPagoAlias: dbSettings.mercado_pago_alias,
            mercadoPagoCvu: dbSettings.mercado_pago_cvu,
            deliveryCost: Number(dbSettings.delivery_cost),
            freeDeliveryThreshold: dbSettings.free_delivery_threshold ? Number(dbSettings.free_delivery_threshold) : undefined,
            storeAddress: dbSettings.store_address,
            enableMercadoPagoSimulator: dbSettings.enable_mercado_pago_simulator,
            notifOrderConfirm: dbSettings.notif_order_confirm || undefined,
            notifPendingPayment: dbSettings.notif_pending_payment || undefined,
            notifShipped: dbSettings.notif_shipped || undefined,
            activePromoTitle: dbSettings.active_promo_title || undefined,
            activePromoText: dbSettings.active_promo_text || undefined,
            activePromoDiscount: dbSettings.active_promo_discount ? Number(dbSettings.active_promo_discount) : undefined,
            activePromoCategory: dbSettings.active_promo_category || undefined,
            activePromoActive: dbSettings.active_promo_active || false
          };
          setSettings(mappedSettings);
        }

        // 4. Fetch Orders
        const { data: dbOrders, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!orderError && dbOrders) {
          const mappedOrders = dbOrders.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            customerAddress: o.customer_address,
            deliveryType: o.delivery_type,
            paymentMethod: o.payment_method,
            items: o.items,
            subtotal: Number(o.subtotal),
            deliveryCost: Number(o.delivery_cost),
            discount: Number(o.discount),
            total: Number(o.total),
            status: o.status,
            createdAt: o.created_at
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // --- Synchronization with LocalStorage for Cart only ---
  useEffect(() => {
    localStorage.setItem('zap_store_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Supabase Update Wrappers ---
  const handleUpdateProducts = async (newProducts: Product[]) => {
    const currentIds = products.map(p => p.id);
    const newIds = newProducts.map(p => p.id);
    const deletedIds = currentIds.filter(id => !newIds.includes(id));
    
    if (deletedIds.length > 0) {
      const { error } = await supabase.from('products').delete().in('id', deletedIds);
      if (error) console.error('Error deleting products from Supabase:', error);
    }
    
    const productsToUpsert = newProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      promo_price: p.promoPrice || null,
      category: p.category,
      subcategory: p.subcategory || null,
      image: p.image,
      stock: p.stock,
      sizes: p.sizes,
      colors: p.colors || [],
      featured: p.featured || false,
      tags: p.tags || [],
      reviews: p.reviews || []
    }));
    
    const { error: upsertError } = await supabase.from('products').upsert(productsToUpsert);
    if (upsertError) {
      console.error('Error upserting products to Supabase:', upsertError);
      triggerToast('Error al guardar cambios en Supabase', 'warning');
    } else {
      setProducts(newProducts);
    }
  };

  const handleUpdateBanners = async (newBanners: PromoBanner[]) => {
    const currentIds = banners.map(b => b.id);
    const newIds = newBanners.map(b => b.id);
    const deletedIds = currentIds.filter(id => !newIds.includes(id));
    
    if (deletedIds.length > 0) {
      const { error } = await supabase.from('banners').delete().in('id', deletedIds);
      if (error) console.error('Error deleting banners from Supabase:', error);
    }
    
    const bannersToUpsert = newBanners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      link_to_category: b.linkToCategory || 'all',
      discount_text: b.discountText || null,
      active: b.active
    }));
    
    const { error: upsertError } = await supabase.from('banners').upsert(bannersToUpsert);
    if (upsertError) {
      console.error('Error upserting banners to Supabase:', upsertError);
      triggerToast('Error al guardar banners en Supabase', 'warning');
    } else {
      setBanners(newBanners);
    }
  };

  const handleUpdateSettings = async (newSettings: StoreSettings) => {
    const settingsToUpsert = {
      id: 1,
      store_name: newSettings.storeName,
      whatsapp_number: newSettings.whatsappNumber,
      currency_symbol: newSettings.currencySymbol,
      mercado_pago_alias: newSettings.mercadoPagoAlias,
      mercado_pago_cvu: newSettings.mercadoPagoCvu,
      delivery_cost: newSettings.deliveryCost,
      free_delivery_threshold: newSettings.freeDeliveryThreshold || null,
      store_address: newSettings.storeAddress,
      enable_mercado_pago_simulator: newSettings.enableMercadoPagoSimulator,
      notif_order_confirm: newSettings.notifOrderConfirm || null,
      notif_pending_payment: newSettings.notifPendingPayment || null,
      notif_shipped: newSettings.notifShipped || null,
      active_promo_title: newSettings.activePromoTitle || null,
      active_promo_text: newSettings.activePromoText || null,
      active_promo_discount: newSettings.activePromoDiscount || null,
      active_promo_category: newSettings.activePromoCategory || null,
      active_promo_active: newSettings.activePromoActive || false
    };
    
    const { error } = await supabase.from('settings').upsert(settingsToUpsert);
    if (error) {
      console.error('Error updating settings in Supabase:', error);
      triggerToast('Error al actualizar configuración en Supabase', 'warning');
    } else {
      setSettings(newSettings);
    }
  };

  const handleClearOrders = async () => {
    if (confirm('¿Desea borrar todo el registro de pedidos?')) {
      const { error } = await supabase.from('orders').delete().neq('id', 'placeholder_non_existent');
      if (error) {
        console.error('Error clearing orders from Supabase:', error);
        triggerToast('Error al limpiar pedidos de Supabase', 'warning');
      } else {
        setOrders([]);
        triggerToast('Registro de pedidos borrado de Supabase');
      }
    }
  };

  // --- Operational App States ---
  const [currentRole, setCurrentRole] = useState<'customer' | 'admin'>('customer');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
  
  // Mercado Pago Connector State
  const [mpModalOpen, setMpModalOpen] = useState(false);
  const [mpOrderDetails, setMpOrderDetails] = useState<any | null>(null);

  // Product Details Modal State
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const handleAddReview = async (productId: string, rating: number, userName: string, comment: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newReview = {
      id: 'rev-' + Date.now(),
      rating,
      userName,
      comment,
      createdAt: new Date().toLocaleDateString('es-AR')
    };
    const updatedReviews = [newReview, ...(prod.reviews || [])];

    const { error } = await supabase
      .from('products')
      .update({ reviews: updatedReviews })
      .eq('id', productId);

    if (error) {
      console.error('Error saving review to Supabase:', error);
      triggerToast('Error al guardar la reseña en Supabase', 'warning');
      return;
    }

    const updatedProduct = {
      ...prod,
      reviews: updatedReviews
    };

    if (selectedProductDetails && selectedProductDetails.id === productId) {
      setSelectedProductDetails(updatedProduct);
    }

    const updated = products.map((p) => (p.id === productId ? updatedProduct : p));
    setProducts(updated);
    triggerToast('¡Gracias por dejar tu reseña!');
  };

  // --- Cart Operations ---
  const handleAddToCart = (product: Product, size: string, color?: string) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      // Check stock limit
      const nextQty = cartItems[existingIndex].quantity + 1;
      if (nextQty <= product.stock) {
        const updated = [...cartItems];
        updated[existingIndex].quantity = nextQty;
        setCartItems(updated);
        triggerToast(`Se aumentó la cantidad de "${product.name}"`);
      } else {
        triggerToast(`No hay suficiente stock disponible de este producto`, 'warning');
      }
    } else {
      // Add new
      setCartItems([...cartItems, { product, selectedSize: size, selectedColor: color, quantity: 1 }]);
      triggerToast(`¡"${product.name}" agregado al carrito!`);
    }
  };

  const handleUpdateCartQuantity = (index: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }

    const item = cartItems[index];
    if (nextQuantity <= item.product.stock) {
      const updated = [...cartItems];
      updated[index].quantity = nextQuantity;
      setCartItems(updated);
    } else {
      triggerToast(`Alcanzaste el límite de stock disponible`, 'warning');
    }
  };

  const handleRemoveCartItem = (index: number) => {
    const item = cartItems[index];
    const updated = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updated);
    triggerToast(`"${item.product.name}" removido`);
  };

  const handleClearCart = () => {
    setCartItems([]);
    triggerToast(`Carrito vaciado con éxito`);
  };

  // --- Order Recording ---
  const handleRegisterOrder = async (newOrder: Order) => {
    const { error } = await supabase.from('orders').insert({
      id: newOrder.id,
      customer_name: newOrder.customerName,
      customer_phone: newOrder.customerPhone,
      customer_address: newOrder.customerAddress,
      delivery_type: newOrder.deliveryType,
      payment_method: newOrder.paymentMethod,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      delivery_cost: newOrder.deliveryCost,
      discount: newOrder.discount,
      total: newOrder.total,
      status: newOrder.status,
      created_at: newOrder.createdAt
    });

    if (error) {
      console.error('Error saving order to Supabase:', error);
      triggerToast('Error al procesar el pedido en el servidor', 'warning');
      return;
    }

    // Deduct stock for each ordered item
    for (const item of newOrder.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const nextStock = Math.max(0, prod.stock - item.quantity);
        const { error: stockErr } = await supabase
          .from('products')
          .update({ stock: nextStock })
          .eq('id', item.productId);
        if (stockErr) console.error('Error updating stock for product:', item.productId, stockErr);
      }
    }

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    const updatedProducts = products.map((prod) => {
      const orderItem = newOrder.items.find((item) => item.productId === prod.id);
      if (orderItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderItem.quantity)
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
  };

  // --- Toast Alert helper ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | null }>({ message: '', type: null });
  const triggerToast = (msg: string, type: 'success' | 'warning' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  // --- Category filtering helper ---
  const filteredProducts = products.filter((p) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'favs' && likedProductIds.includes(p.id)) ||
      p.category === selectedCategory ||
      p.subcategory === selectedCategory;

    // Search query match
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white/90 font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <Sparkles className="absolute text-orange-500 animate-pulse" size={24} />
        </div>
        <p className="mt-4 text-sm font-bold tracking-wider uppercase text-white/60">Cargando Tienda Digital...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white/90 antialiased selection:bg-orange-500 selection:text-black">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedCategory('all'); setCurrentRole('customer'); }}>
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm shrink-0 shadow-md">
              <div className="w-4 h-4 bg-black rotate-45"></div>
            </div>
            <div>
              <span className="font-sans font-black text-xl text-white tracking-tighter uppercase italic block leading-none">
                {settings.storeName.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-orange-500 tracking-widest block uppercase mt-0.5">
                CALZADO & TEXTIL
              </span>
            </div>
          </div>

          {/* Search bar (Only Customer View) */}
          {currentRole === 'customer' && (
            <div className="hidden md:flex items-center flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Buscar zapatillas, buzos, remeras, talles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 focus:bg-[#151515] focus:border-orange-500/50 text-white text-xs outline-none transition-all"
              />
              <Search size={15} className="absolute left-3.5 text-white/40 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-white/40 hover:text-orange-500 text-xs font-bold transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}

          {/* Actions & Role Selector */}
          <div className="flex items-center gap-3">
            {/* View Role Switcher */}
            <button
              onClick={() => {
                setCurrentRole(currentRole === 'customer' ? 'admin' : 'customer');
                setIsCartOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                currentRole === 'admin'
                  ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/20'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {currentRole === 'admin' ? (
                <>
                  <Store size={14} />
                  Ver Tienda
                </>
              ) : (
                <>
                  <Settings size={14} />
                  Panel Administrador
                </>
              )}
            </button>

            {/* Cart Trigger Button (Only Customer) */}
            {currentRole === 'customer' && (
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isCartOpen
                    ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                aria-label="Abrir carrito"
              >
                <ShoppingBag size={18} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-orange-600 text-white font-extrabold font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg border border-black/10">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Bar (Only Customer View) */}
      {currentRole === 'customer' && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-white/10 px-4 py-2.5">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar calzado, remeras, marcas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:bg-[#151515] focus:border-orange-500/50 transition-all"
            />
            <Search size={14} className="absolute left-3 text-white/40 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* A. CUSTOMER STOREFRONT VIEW */}
          {currentRole === 'customer' && !isCartOpen && (
            <motion.div
              key="customer-storefront"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Dynamic Sliding Banners Slider (Advertising) */}
              <PromoSlider banners={banners} onCategorySelect={(cat) => setSelectedCategory(cat as any)} />

              {/* Active AI Promo Campaign Banner */}
              {settings.activePromoActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 p-6 rounded-2xl border border-orange-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  {/* Decorative background visual elements */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-black/20 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="space-y-2 z-10 text-center md:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <span className="bg-black text-orange-400 text-[9px] font-black tracking-widest px-2.5 py-1 rounded uppercase border border-orange-400/20 flex items-center gap-1">
                        <Sparkles size={11} className="animate-spin" />
                        CAMPAÑA IA ACTIVA
                      </span>
                      {settings.activePromoDiscount && (
                        <span className="bg-white text-red-600 text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase">
                          🔥 {settings.activePromoDiscount}% OFF EXTRA
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-tight">
                      {settings.activePromoTitle || 'Oferta Relámpago de la Semana'}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-white/95 max-w-2xl font-medium leading-relaxed">
                      {settings.activePromoText || 'Aproveche nuestros descuentos limitados en indumentaria y calzado con envío gratuito hoy mismo.'}
                    </p>

                    {settings.activePromoCategory && settings.activePromoCategory !== 'all' && (
                      <p className="text-[11px] text-orange-200 font-mono">
                        Aplicable a la categoría: <span className="underline font-black uppercase text-white">{settings.activePromoCategory}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 z-10 shrink-0 w-full md:w-auto text-xs">
                    {settings.activePromoCategory && settings.activePromoCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory(settings.activePromoCategory || 'all')}
                        className="px-5 py-3 bg-black hover:bg-black/80 text-white font-black uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg w-full sm:w-auto"
                      >
                        Filtrar Categoría 👕
                      </button>
                    )}
                    
                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola! Quiero activar la promoción de la tienda: "${settings.activePromoTitle}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-white hover:bg-gray-100 text-black font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg w-full sm:w-auto"
                    >
                      <Phone size={14} />
                      Reclamar por WhatsApp 💬
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Category selector row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none border-b border-white/10">
                {[
                  { id: 'all', label: 'Todo', icon: '✨' },
                  { id: 'playeras', label: 'Playeras 👕', icon: '👕' },
                  { id: 'pantalones', label: 'Pantalones 👖', icon: '👖' },
                  { id: 'jeans', label: 'Jeans 👖', icon: '👖' },
                  { id: 'sudaderas', label: 'Sudaderas 🧥', icon: '🧥' },
                  { id: 'camisolas', label: 'Camisolas 👔', icon: '👔' },
                  { id: 'zapatillas', label: 'Zapatillas 👟', icon: '👟' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/10'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="mr-1.5">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Secondary Category Filter Metadata */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                    {selectedCategory === 'all'
                      ? 'Nuestros Productos'
                      : selectedCategory === 'playeras'
                        ? 'Playeras & Remeras'
                        : selectedCategory === 'pantalones'
                          ? 'Pantalones & Cargo'
                          : selectedCategory === 'jeans'
                            ? 'Colección Denim Jeans'
                            : selectedCategory === 'sudaderas'
                              ? 'Sudaderas & Hoodies'
                              : selectedCategory === 'camisolas'
                                ? 'Camisolas & Camisas'
                                : selectedCategory === 'zapatillas'
                                  ? 'Zapatillas & Calzado'
                                  : 'Colección ' + selectedCategory}
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    Mostrando <span className="text-orange-500 font-bold font-mono">{filteredProducts.length}</span> productos disponibles con stock en tiempo real.
                  </p>
                </div>
              </div>

              {/* Products Catalog Grid */}
              {filteredProducts.length === 0 ? (
                <div id="no-search-results" className="text-center py-16 bg-[#111111] border border-white/5 rounded-2xl p-6">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/40 mb-4">
                    <Search size={24} />
                  </div>
                  <h3 className="font-bold text-base text-white">No encontramos resultados</h3>
                  <p className="text-xs text-white/40 mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Probá buscando con otros términos o seleccioná una categoría diferente en el menú de arriba.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      currencySymbol={settings.currencySymbol}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(prod) => setSelectedProductDetails(prod)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* B. DETAILED SHOPPING CART VIEW */}
          {currentRole === 'customer' && isCartOpen && (
            <motion.div
              key="customer-cart-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Cart Header breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-white/40 font-semibold">
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsCartOpen(false)}>Tienda</span>
                <ChevronRight size={12} />
                <span className="text-white">Carrito de compras</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Tu Carrito de Compras</h2>
                  <p className="text-xs text-white/50">Revisá tu pedido, seleccioná el método de entrega y realizá el pago.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Volver a la Tienda
                </button>
              </div>

              {/* Interactive Cart Dashboard */}
              <Cart
                cartItems={cartItems}
                settings={settings}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onOpenMercadoPago={(details) => {
                  setMpOrderDetails(details);
                  setMpModalOpen(true);
                }}
                onRegisterOrder={handleRegisterOrder}
              />
            </motion.div>
          )}

          {/* C. SELLER ADMIN PANEL VIEW */}
          {currentRole === 'admin' && (
            <motion.div
              key="seller-admin-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Admin Head title */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Panel de Gestión Comercial</h2>
                  <p className="text-xs text-white/50">Control total del inventario textil, precios, banners publicitarios y stock.</p>
                </div>
                <button
                  onClick={() => setCurrentRole('customer')}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Store size={14} />
                  Ver Tienda Pública
                </button>
              </div>

              {/* Full Featured Admin Panel Dashboard */}
              <AdminPanel
                products={products}
                banners={banners}
                settings={settings}
                orders={orders}
                onUpdateProducts={handleUpdateProducts}
                onUpdateBanners={handleUpdateBanners}
                onUpdateSettings={handleUpdateSettings}
                onClearOrders={handleClearOrders}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. Global Action Toast Alert */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm text-xs font-bold border"
            style={{
              backgroundColor: toast.type === 'warning' ? '#FFFBEB' : '#F0FDF4',
              borderColor: toast.type === 'warning' ? '#FDE68A' : '#BBF7D0',
              color: toast.type === 'warning' ? '#92400E' : '#166534',
            }}
          >
            {toast.type === 'warning' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Simulated Mercado Pago Gateway Connector */}
      <MercadoPagoModal
        isOpen={mpModalOpen}
        onClose={() => {
          setMpModalOpen(false);
          setMpOrderDetails(null);
        }}
        orderDetails={mpOrderDetails}
        settings={settings}
      />

      {/* Product Details & Reviews Modal */}
      <AnimatePresence>
        {selectedProductDetails && (
          <ProductDetailsModal
            product={selectedProductDetails}
            currencySymbol={settings.currencySymbol}
            isOpen={selectedProductDetails !== null}
            onClose={() => setSelectedProductDetails(null)}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddReview}
          />
        )}
      </AnimatePresence>

      {/* 6. Footer Layout */}
      <footer className="mt-20 bg-[#0F0F0F] text-white/90 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            {/* Store Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm shrink-0">
                  <div className="w-3 h-3 bg-black rotate-45"></div>
                </div>
                <span className="font-black text-base uppercase tracking-tight italic">{settings.storeName.toUpperCase()}</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                Tu tienda digital ágil para calzado de vanguardia y prendas textiles de primera calidad. Elegí, pagá con el simulador de Mercado Pago y coordiná directo por WhatsApp.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">Enlaces Útiles</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => { setSelectedCategory('all'); setCurrentRole('customer'); setIsCartOpen(false); }}
                    className="text-white/40 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    Explorar Todo el Catálogo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedCategory('zapatillas'); setCurrentRole('customer'); setIsCartOpen(false); }}
                    className="text-white/40 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    Ver Zapatillas y Calzado
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedCategory('ropa'); setCurrentRole('customer'); setIsCartOpen(false); }}
                    className="text-white/40 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    Ver Catálogo Textil / Ropa
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact details */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">Contacto de la Sucursal</h4>
              <ul className="space-y-2 text-white/40">
                <li className="flex items-center gap-2">
                  <Phone size={13} className="shrink-0 text-orange-500" />
                  <span>+{settings.whatsappNumber}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={13} className="shrink-0 mt-0.5 text-orange-500" />
                  <span className="leading-relaxed">{settings.storeAddress}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30 font-medium">
            <p>© 2026 {settings.storeName.toUpperCase()}. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors">Simulación de Mercado Pago</span>
              <span className="hover:text-white transition-colors">Integración WhatsApp</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Trigger Vercel Build
