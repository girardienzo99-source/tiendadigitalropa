import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, DollarSign, Image as ImageIcon, Settings, TrendingUp, AlertTriangle, CheckCircle,
  Plus, Edit2, Trash2, Save, X, Phone, ShoppingBag, Eye, RefreshCw, Layers, ArrowUpRight, ArrowDownRight, Tag, Sparkles
} from 'lucide-react';
import { Product, PromoBanner, StoreSettings, Order } from '../types';

interface AdminPanelProps {
  products: Product[];
  banners: PromoBanner[];
  settings: StoreSettings;
  orders: Order[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateBanners: (newBanners: PromoBanner[]) => void;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onClearOrders: () => void;
}

export default function AdminPanel({
  products,
  banners,
  settings,
  orders,
  onUpdateProducts,
  onUpdateBanners,
  onUpdateSettings,
  onClearOrders,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'pricing' | 'stock' | 'advertising' | 'settings' | 'orders' | 'marketing'>('catalog');

  // Marketing & WhatsApp state variables
  const [broadcastProduct, setBroadcastProduct] = useState<string>('all');
  const [broadcastObjective, setBroadcastObjective] = useState<string>('descuento_flash');
  const [broadcastDiscount, setBroadcastDiscount] = useState<number>(15);
  const [broadcastAddInfo, setBroadcastAddInfo] = useState<string>('');
  const [isGeneratingBroadcast, setIsGeneratingBroadcast] = useState<boolean>(false);
  const [generatedBroadcastMessage, setGeneratedBroadcastMessage] = useState<string>('');
  const [broadcastCopied, setBroadcastCopied] = useState<boolean>(false);

  const [adCategory, setAdCategory] = useState<string>('all');
  const [adObjective, setAdObjective] = useState<string>('venta_directa');
  const [adAudienceNotes, setAdAudienceNotes] = useState<string>('');
  const [isGeneratingAdProfile, setIsGeneratingAdProfile] = useState<boolean>(false);
  const [generatedAdProfile, setGeneratedAdProfile] = useState<string>('');
  const [adProfileCopied, setAdProfileCopied] = useState<boolean>(false);

  // Broader Advertising Angles & Store Interactivity states
  const [anglesProduct, setAnglesProduct] = useState<string>('all');
  const [anglesDiscount, setAnglesDiscount] = useState<number>(settings.activePromoDiscount || 15);
  const [anglesAddInfo, setAnglesAddInfo] = useState<string>('');
  const [isGeneratingAngles, setIsGeneratingAngles] = useState<boolean>(false);
  const [generatedAnglesText, setGeneratedAnglesText] = useState<string>('');
  const [anglesCopied, setAnglesCopied] = useState<boolean>(false);

  // Published Promo parameters (interactive on customer page)
  const [isPromoPublished, setIsPromoPublished] = useState<boolean>(settings.activePromoActive || false);
  const [publishedPromoTitle, setPublishedPromoTitle] = useState<string>(settings.activePromoTitle || '🔥 Promo Relámpago de la Semana');
  const [publishedPromoText, setPublishedPromoText] = useState<string>(settings.activePromoText || 'Comprando cualquier prenda o zapatilla de nuestra colección, llevate un 15% de descuento directo y envío gratis en pedidos seleccionados. ¡Respondé o comprá hoy!');

  // Automatic Message Trigger states
  const [notifOrderConfirm, setNotifOrderConfirm] = useState<string>(settings.notifOrderConfirm || '¡Hola {CLIENTE}! Recibimos tu pedido #{PEDIDO_ID} de {PRODUCTOS} por un total de {TOTAL}. ¡Gracias por confiar en nosotros! 🛍️');
  const [notifPendingPayment, setNotifPendingPayment] = useState<string>(settings.notifPendingPayment || '¡Hola {CLIENTE}! Para confirmar tu pedido #{PEDIDO_ID} de {TOTAL}, completá el pago a nuestro Alias: {ALIAS_MP} y envianos el comprobante por acá. ¡Muchas gracias! 🏦');
  const [notifShipped, setNotifShipped] = useState<string>(settings.notifShipped || '¡Hola {CLIENTE}! Tu pedido #{PEDIDO_ID} de {PRODUCTOS} ya fue despachado y va en viaje a tu domicilio. ¡Disfrutalo! 🚚');

  useEffect(() => {
    if (settings.notifOrderConfirm) setNotifOrderConfirm(settings.notifOrderConfirm);
    if (settings.notifPendingPayment) setNotifPendingPayment(settings.notifPendingPayment);
    if (settings.notifShipped) setNotifShipped(settings.notifShipped);
  }, [settings]);

  const handleSaveTemplates = () => {
    onUpdateSettings({
      ...settings,
      notifOrderConfirm,
      notifPendingPayment,
      notifShipped
    });
    alert('Plantillas de automatización guardadas exitosamente.');
  };

  const generateLocalCopyFallback = (type: 'broadcast' | 'ad_profile', prodName: string) => {
    if (type === 'broadcast') {
      const pName = prodName || 'nuestro catálogo exclusivo textil y de calzado';
      const descText = broadcastDiscount ? `*🔥 ¡${broadcastDiscount}% DE DESCUENTO EXTRA! 🔥*` : '*✨ ¡ENVÍO SIN CARGO EN TU COMPRA! ✨*';
      
      let localMsg = `🛍️ *NUEVA PROMOCIÓN - ${settings.storeName}*\n`;
      localMsg += `📅 _Válido por tiempo limitado_\n`;
      localMsg += `-----------------------------------------\n\n`;
      if (broadcastObjective === 'descuento_flash') {
        localMsg += `⚡ *OFERTA RELÁMPAGO POR 24 HORAS* ⚡\n\n¡Hola! Queremos contarte que hoy tenemos una promo imperdible en nuestra línea de *${pName}*.\n\n${descText}\n\n👟 Conseguí tus talles y colores preferidos antes de que se agoten. ¡El stock vuela hoy mismo!\n\n📌 *¿Cómo comprar?*\nRespondé directamente a este mensaje de WhatsApp indicándome tu talle preferido y te reservamos el pedido al instante.\n\n💳 _Aceptamos Mercado Pago y Transferencia Bancaria Directa._\n\n🚚 Envíos rápidos y seguros a todo el país.`;
      } else if (broadcastObjective === 'lanzamiento') {
        localMsg += `✨ *LANZAMIENTO EXCLUSIVO: NUEVA TEMPORADA* ✨\n\n¡Hola! Mirá lo nuevo de alta gama que ingresó a nuestro local: *${pName}*.\n\n💥 Diseños con materiales seleccionados y el calce perfecto que estabas buscando.\n\n👉 Respondé este mensaje hoy y conseguilo con un *regalo sorpresa de lanzamiento* o envío bonificado.\n\n¡Escribinos antes de que se terminen los talles más solicitados!`;
      } else if (broadcastObjective === 'liquidacion') {
        localMsg += `📦 *LIQUIDACIÓN CRÍTICA DE STOCK* 📦\n\n¡Hola! Estamos liberando depósito para la nueva temporada y liquidamos las últimas unidades de *${pName}*.\n\n${descText}\n\n⚠️ ¡Precios de costo hasta agotar stock físico! No dejes pasar esta oportunidad.\n\n📥 Escribinos tu talle ahora mismo para verificar disponibilidad en sistema y te lo despachamos en el día.`;
      } else {
        localMsg += `👋 *REGALO ESPECIAL DE BIENVENIDA* 👋\n\n¡Hola! Gracias por formar parte de la comunidad de *${settings.storeName}*.\n\nQueremos regalarte un beneficio único en tu primera compra en *${pName}*.\n\n${descText}\n\nConseguí calzado de primera y prendas de diseño con envío asegurado.\n\n💬 Respondé con los modelos y talles que te gustaron y te guiamos en la compra paso a paso por acá.`;
      }
      setGeneratedBroadcastMessage(localMsg);
    } else {
      const catLabel = adCategory === 'all' ? 'Moda Textil y Zapatillas' : adCategory.toUpperCase();
      let localAd = `🎯 PERFIL DE PUBLICIDAD ESTRATÉGICA Y MARKETING\n`;
      localAd += `==================================================\n\n`;
      localAd += `👤 ARQUETIPO DEL CLIENTE IDEAL (PÚBLICO OBJETIVO):\n`;
      localAd += `• Segmento Principal: Jóvenes y adultos de 18 a 38 años interesados en calzado cómodo, moda urbana, tendencias en streetwear y cultura sneakerhead.\n`;
      localAd += `• Motivadores de compra: Exclusividad, facilidad de pago con Mercado Pago, asesoramiento inmediato por WhatsApp y envío rápido.\n`;
      localAd += `• Hábitos digitales: Instagram Stories, Reels, TikTok y canales de difusión directa.\n\n`;
      localAd += `💡 CONCEPTOS CLAVE DE LA CAMPAÑA:\n`;
      localAd += `• Slogan Recomendado: "Caminá el futuro con estilo y confort premium. Hecho para tu día a día."\n`;
      localAd += `• Propuesta de valor: Envíos con seguimiento y atención 100% personalizada por WhatsApp.\n\n`;
      localAd += `📸 GUION PROPUESTO PARA INSTAGRAM STORIES (15 Segundos):\n`;
      localAd += `• [Segundo 0 a 3 - El Gancho]: Plano detalle en movimiento y alta definición mostrando el producto estrella. Música urbana en tendencia. Texto: "¿Buscando renovar tu estilo?"\n`;
      localAd += `• [Segundo 3 a 12 - El Beneficio]: Transición rápida mostrando variedad de colores y talles disponibles. Texto: "Descubrí calzado ultra-resistente y textil de puro algodón. Comodidad absoluta en cada paso."\n`;
      localAd += `• [Segundo 12 a 15 - El CTA]: Texto final animado: "Toca el enlace de abajo o envianos un mensaje directo para reservar tu talle hoy con Mercado Pago. ¡Envíos en el día!"\n\n`;
      localAd += `📊 PRESUPUESTO & CANALES DE VENTA RECOMENDADOS:\n`;
      localAd += `• Canales prioritarios: Meta Ads (Instagram Story/Reels) dirigido a tráfico directo a tu canal de WhatsApp.\n`;
      localAd += `• Presupuesto Diario Inicial Recomendado: $3.000 a $5.000 ARS para optimizar conversiones de forma ágil.\n`;
      localAd += `• Palabras clave sugeridas para pauta: Zapatillas, Ropa casual, Streetwear, Compras Online, Calzado deportivo.`;
      setGeneratedAdProfile(localAd);
    }
  };

  const handleGenerateCopy = async (type: 'broadcast' | 'ad_profile') => {
    if (type === 'broadcast') {
      setIsGeneratingBroadcast(true);
      setGeneratedBroadcastMessage('');
      try {
        const prod = products.find(p => p.id === broadcastProduct);
        const prodName = prod ? prod.name : '';
        const res = await fetch('/api/marketing/generate-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptType: 'broadcast',
            productName: prodName,
            category: broadcastProduct === 'all' ? 'Todo el Catálogo' : undefined,
            objective: broadcastObjective,
            discount: broadcastDiscount,
            additionalInfo: broadcastAddInfo
          })
        });
        const data = await res.json();
        if (data.success && data.text) {
          setGeneratedBroadcastMessage(data.text);
        } else {
          generateLocalCopyFallback('broadcast', prodName);
        }
      } catch (err) {
        console.error(err);
        const prod = products.find(p => p.id === broadcastProduct);
        generateLocalCopyFallback('broadcast', prod ? prod.name : '');
      } finally {
        setIsGeneratingBroadcast(false);
      }
    } else {
      setIsGeneratingAdProfile(true);
      setGeneratedAdProfile('');
      try {
        const res = await fetch('/api/marketing/generate-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptType: 'ad_profile',
            category: adCategory,
            objective: adObjective,
            additionalInfo: adAudienceNotes
          })
        });
        const data = await res.json();
        if (data.success && data.text) {
          setGeneratedAdProfile(data.text);
        } else {
          generateLocalCopyFallback('ad_profile', '');
        }
      } catch (err) {
        console.error(err);
        generateLocalCopyFallback('ad_profile', '');
      } finally {
        setIsGeneratingAdProfile(false);
      }
    }
  };

  const generateAnglesLocalFallback = (prodName: string) => {
    let localAngles = `🔥 ÁNGULO 1: FÓRMULA A.I.D.A. (Atención, Interés, Deseo, Acción)
[Atención]: ¿Cansado de la ropa urbana sin actitud o del calzado incómodo que no dura nada? 🛑 ¡Es hora de pisar fuerte!
[Interés]: Descubrí la colección exclusiva de ${prodName || 'nuestra tienda urbana'}, diseñada con materiales de máxima resistencia, costuras reforzadas y un calce ergonómico que se adapta a tu ritmo diario.
[Deseo]: Llevátelo HOY mismo con un espectacular ${anglesDiscount}% de descuento y cuotas sin interés. ¡Elevá tu estilo y sentí el confort premium en cada pisada!
[Acción]: Respondé "ME INTERESA" ahora mismo para recibir asesoramiento personalizado de talles y asegurar tu modelo antes de que se agoten las unidades limitadas.

💡 ÁNGULO 2: FÓRMULA P.A.S. (Problema, Agitación, Solución)
[Problema]: Encontrar ropa urbana y calzado que combinen un diseño impecable, durabilidad real y un precio justo parece una misión imposible hoy en día. O te duele el talle, o la tela cede al primer lavado.
[Agitación]: Gastar en prendas que pierden el color o zapatillas que se deforman rápido es sumamente frustrante. Te merecés lucir bien y sentirte cómodo todo el día sin preocuparte por la calidad.
[Solución]: En ${settings.storeName} resolvemos esto ofreciéndote la mejor selección de ${prodName || 'indumentaria y zapatillas premium'} con control de calidad riguroso. Y para que lo compruebes vos mismo, hoy te regalamos un ${anglesDiscount}% de descuento de bienvenida con envíos veloces a todo el país. ¡Escribinos para ver el catálogo!

✨ ÁNGULO 3: GANCHO DE ESTILO DE VIDA (Lifestyle & Status)
Visualizá esto: Vos caminando por la ciudad con total confianza, vistiendo prendas que hablan de tu personalidad y calzando el diseño urbano más codiciado de la temporada. 😎 
En ${settings.storeName} no vendemos solo moda, vendemos seguridad, actitud y estilo de vida activo. No dejes pasar el tren: aprovechá nuestro descuento de ${anglesDiscount}% y renová tu outfit con envíos gratis a domicilio. ¡El futuro pertenece a los que se animan a vestir diferente!

🎬 ÁNGULO 4: GUION COMPACTO PARA TIKTOK / REELS (Formato Viral)
[0-3s] GANCHO: (Mostrar calzado/prenda en primer plano con transición rápida de luz) "¿Seguís usando las mismas zapas aburridas de siempre? ¡Basta de eso! Mira esta locura..."
[3-12s] BENEFICIO: (Mostrar detalles de tela, costura o suela flexible) "Algodón súper denso que no se deforma, o calzado con amortiguación premium de aire. Cómodos para el gimnasio, el trabajo o salir el fin de semana."
[12-15s] CTA: "Respondé a este video para conseguir un código de ${anglesDiscount}% OFF especial de TikTok y envío gratis hoy."`;

    setGeneratedAnglesText(localAngles);
  };

  const handleGenerateAngles = async () => {
    setIsGeneratingAngles(true);
    setGeneratedAnglesText('');
    const selectedProd = products.find(p => p.id === anglesProduct);
    const prodName = selectedProd ? selectedProd.name : 'nuestro catálogo urbano';
    
    try {
      const res = await fetch('/api/marketing/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType: 'broader_angles',
          productName: prodName,
          category: anglesProduct === 'all' ? 'Todo el Catálogo' : undefined,
          discount: anglesDiscount,
          additionalInfo: anglesAddInfo
        })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setGeneratedAnglesText(data.text);
      } else {
        generateAnglesLocalFallback(prodName);
      }
    } catch (err) {
      console.error(err);
      generateAnglesLocalFallback(prodName);
    } finally {
      setIsGeneratingAngles(false);
    }
  };

  const handlePublishPromo = () => {
    onUpdateSettings({
      ...settings,
      activePromoActive: isPromoPublished,
      activePromoTitle: publishedPromoTitle,
      activePromoText: publishedPromoText,
      activePromoDiscount: Number(anglesDiscount),
      activePromoCategory: anglesProduct
    });
    alert(`Campaña de publicidad interactiva ${isPromoPublished ? 'PUBLICADA y ACTIVA en la tienda' : 'DESACTIVADA'} con éxito.`);
  };
  
  // States for product form modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form Fields
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pPromoPrice, setPPromoPrice] = useState<number | undefined>(undefined);
  const [pCategory, setPCategory] = useState<'zapatillas' | 'ropa' | 'accesorios'>('zapatillas');
  const [pSubcategory, setPSubcategory] = useState<string>('');
  const [pImage, setPImage] = useState('');
  const [pStock, setPStock] = useState(0);
  const [pSizes, setPSizes] = useState<string>('');
  const [pColors, setPColors] = useState<string>('');
  const [pTags, setPTags] = useState<string>('');
  const [pFeatured, setPFeatured] = useState(false);

  // General Mass Pricing Adjuster state
  const [massPercentage, setMassPercentage] = useState<number>(0);
  const [massTargetCategory, setMassTargetCategory] = useState<'all' | 'zapatillas' | 'ropa' | 'accesorios'>('all');
  const [massActionType, setMassActionType] = useState<'surcharge' | 'discount'>('surcharge');

  // Advertising Banner states
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [bTitle, setBTitle] = useState('');
  const [bSubtitle, setBSubtitle] = useState('');
  const [bImage, setBImage] = useState('');
  const [bDiscountText, setBDiscountText] = useState('');
  const [bCategory, setBCategory] = useState<'zapatillas' | 'ropa' | 'accesorios' | 'all'>('all');

  // Quick Price Edit States
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);
  const [quickPromoVal, setQuickPromoVal] = useState<number | undefined>(undefined);

  const startQuickEdit = (p: Product) => {
    setQuickEditId(p.id);
    setQuickPriceVal(p.price);
    setQuickPromoVal(p.promoPrice);
  };

  const saveQuickEdit = (productId: string) => {
    const updated = products.map((prod) => {
      if (prod.id === productId) {
        return {
          ...prod,
          price: Number(quickPriceVal),
          promoPrice: quickPromoVal && quickPromoVal > 0 ? Number(quickPromoVal) : undefined,
        };
      }
      return prod;
    });
    onUpdateProducts(updated);
    setQuickEditId(null);
  };

  // Stats calculation
  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  // Opens modal to add new product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPId(`zap-${Date.now().toString().slice(-4)}`);
    setPName('');
    setPDescription('');
    setPCategory('zapatillas');
    setPSubcategory('');
    setPPrice(0);
    setPPromoPrice(undefined);
    setPImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80');
    setPStock(10);
    setPSizes('39, 40, 41, 42, 43');
    setPColors('Negro, Blanco');
    setPTags('Nuevo');
    setPFeatured(false);
    setIsProductModalOpen(true);
  };

  // Opens modal to edit existing product
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setPId(product.id);
    setPName(product.name);
    setPDescription(product.description);
    setPCategory(product.category);
    setPSubcategory(product.subcategory || '');
    setPPrice(product.price);
    setPPromoPrice(product.promoPrice);
    setPImage(product.image);
    setPStock(product.stock);
    setPSizes(product.sizes.join(', '));
    setPColors(product.colors ? product.colors.join(', ') : '');
    setPTags(product.tags ? product.tags.join(', ') : '');
    setPFeatured(product.featured || false);
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArr = pSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = pColors.split(',').map(c => c.trim()).filter(Boolean);
    const tagsArr = pTags.split(',').map(t => t.trim()).filter(Boolean);

    const savedProduct: Product = {
      id: pId,
      name: pName,
      description: pDescription,
      price: Number(pPrice),
      promoPrice: pPromoPrice ? Number(pPromoPrice) : undefined,
      category: pCategory,
      subcategory: pSubcategory ? (pSubcategory as any) : undefined,
      image: pImage,
      stock: Number(pStock),
      sizes: sizesArr,
      colors: colorsArr.length > 0 ? colorsArr : undefined,
      tags: tagsArr.length > 0 ? tagsArr : undefined,
      featured: pFeatured
    };

    if (editingProduct) {
      // Edit mode
      const updated = products.map(p => p.id === editingProduct.id ? savedProduct : p);
      onUpdateProducts(updated);
    } else {
      // Add mode
      if (products.some(p => p.id === pId)) {
        alert('Ya existe un producto con este ID. Se ha regenerado un ID único.');
        savedProduct.id = `${pCategory.slice(0,3)}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      onUpdateProducts([...products, savedProduct]);
    }
    setIsProductModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de que querés eliminar este producto de la tienda?')) {
      const filtered = products.filter(p => p.id !== productId);
      onUpdateProducts(filtered);
    }
  };

  // Quick stock updater
  const handleAdjustStock = (productId: string, amount: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + amount);
        return { ...p, stock: nextStock };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Quick price updater via input
  const handlePriceFieldChange = (productId: string, newPrice: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, price: Math.max(0, newPrice) };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Mass price adjuster execution (recargo / descuento general)
  const handleApplyMassPricing = () => {
    if (massPercentage <= 0) {
      alert('Ingresá un porcentaje mayor a 0');
      return;
    }

    const coefficient = massActionType === 'surcharge' 
      ? (1 + massPercentage / 100) 
      : (1 - massPercentage / 100);

    const updated = products.map(p => {
      if (massTargetCategory === 'all' || p.category === massTargetCategory) {
        // Apply directly to price
        const adjustedPrice = Math.round(p.price * coefficient);
        
        // Also adjust promo price if it exists
        const adjustedPromoPrice = p.promoPrice 
          ? Math.round(p.promoPrice * coefficient) 
          : undefined;

        return {
          ...p,
          price: adjustedPrice,
          promoPrice: adjustedPromoPrice
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    setMassPercentage(0);
    alert(`Se aplicó un ${massActionType === 'surcharge' ? 'recargo' : 'descuento'} del ${massPercentage}% exitosamente.`);
  };

  // Clear all promotions/discounts in a category
  const handleClearDiscounts = (category: 'all' | 'zapatillas' | 'ropa' | 'accesorios') => {
    if (confirm(`¿Eliminar todos los precios promocionales de la categoría: ${category}?`)) {
      const updated = products.map(p => {
        if (category === 'all' || p.category === category) {
          const { promoPrice, ...rest } = p;
          return rest as Product;
        }
        return p;
      });
      onUpdateProducts(updated);
    }
  };

  // Opens banner editor
  const handleOpenEditBanner = (index: number) => {
    const banner = banners[index];
    setEditingBannerIndex(index);
    setBTitle(banner.title);
    setBSubtitle(banner.subtitle);
    setBImage(banner.image);
    setBDiscountText(banner.discountText || '');
    setBCategory(banner.linkToCategory || 'all');
  };

  // Saves updated banner
  const handleSaveBanner = () => {
    if (editingBannerIndex === null) return;
    const updated = [...banners];
    updated[editingBannerIndex] = {
      ...updated[editingBannerIndex],
      title: bTitle,
      subtitle: bSubtitle,
      image: bImage,
      discountText: bDiscountText || undefined,
      linkToCategory: bCategory
    };
    onUpdateBanners(updated);
    setEditingBannerIndex(null);
  };

  // Toggles banner active/inactive
  const handleToggleBanner = (index: number) => {
    const updated = [...banners];
    updated[index].active = !updated[index].active;
    onUpdateBanners(updated);
  };

  // Save general configuration settings
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: StoreSettings = {
      storeName: formData.get('storeName') as string,
      whatsappNumber: (formData.get('whatsappNumber') as string).replace(/\+/g, '').replace(/\s/g, ''),
      currencySymbol: formData.get('currencySymbol') as string,
      mercadoPagoAlias: formData.get('mercadoPagoAlias') as string,
      mercadoPagoCvu: formData.get('mercadoPagoCvu') as string,
      deliveryCost: Number(formData.get('deliveryCost')),
      freeDeliveryThreshold: formData.get('freeDeliveryThreshold') ? Number(formData.get('freeDeliveryThreshold')) : undefined,
      storeAddress: formData.get('storeAddress') as string,
      enableMercadoPagoSimulator: formData.get('enableSimulator') === 'true'
    };
    onUpdateSettings(updated);
    alert('Configuración guardada correctamente.');
  };

  return (
    <div id="admin-panel-container" className="space-y-6 text-white">
      {/* 1. Header Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total revenue */}
        <div className="bg-[#111111] p-4 rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-600/10 text-orange-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 font-bold uppercase block">Ingresos de Prueba</span>
            <span className="text-sm font-black text-white font-mono">
              {settings.currencySymbol}
              {totalRevenue.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Total Catalog Items */}
        <div className="bg-[#111111] p-4 rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-600/10 text-orange-500">
            <Package size={20} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 font-bold uppercase block">Total Productos</span>
            <span className="text-sm font-black text-white font-mono">{products.length} Items</span>
          </div>
        </div>

        {/* Inventory total cost */}
        <div className="bg-[#111111] p-4 rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-600/10 text-orange-500">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 font-bold uppercase block">Valor del Stock</span>
            <span className="text-sm font-black text-white font-mono">
              {settings.currencySymbol}
              {totalStockValue.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Inventory low/out alert */}
        <div className="bg-[#111111] p-4 rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-600/10 text-orange-500">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 font-bold uppercase block">Alertas Stock</span>
            <span className="text-sm font-black text-white">
              {lowStockCount} Bajo | {outOfStockCount} S/S
            </span>
          </div>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-px">
        {[
          { id: 'catalog', label: 'Inventario', icon: Package },
          { id: 'pricing', label: 'Lista de Precios', icon: DollarSign },
          { id: 'stock', label: 'Control de Stock', icon: AlertTriangle },
          { id: 'advertising', label: 'Publicidad (Ads)', icon: ImageIcon },
          { id: 'marketing', label: 'Marketing & WhatsApp', icon: TrendingUp },
          { id: 'settings', label: 'Configuración', icon: Settings },
          { id: 'orders', label: 'Pedidos Recibidos', icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/15'
                  : 'text-white/45 hover:text-white border-transparent hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {tab.id === 'orders' && orders.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                  {orders.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Panel Content Switch */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 md:p-6 shadow-2xl">
        
        {/* TAB 1: CATALOG INVENTORY */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-lg text-white">Catálogo de Productos</h3>
                <p className="text-xs text-white/40">Agregá, editá y eliminá zapatillas o productos textiles de la tienda.</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-lg shadow-orange-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                Agregar Producto
              </button>
            </div>

            {/* Catalog Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => {
                const hasDiscount = p.promoPrice && p.promoPrice < p.price;
                return (
                  <div key={p.id} className="p-4 rounded-xl border border-white/5 bg-white/5 flex gap-3 hover:border-white/15 transition-all relative">
                    {/* Item thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase text-white/50 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-white/30 font-mono">#{p.id}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white truncate mt-1">{p.name}</h4>
                      
                      {quickEditId === p.id ? (
                        <div className="mt-2 space-y-1.5 bg-[#0D0D0D] p-2 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-bold text-white/40 font-mono">P. Base:</span>
                            <div className="flex items-center gap-0.5 bg-[#141414] px-1 rounded border border-white/5">
                              <span className="text-[10px] text-white/40">{settings.currencySymbol}</span>
                              <input
                                type="number"
                                value={quickPriceVal}
                                onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                                className="w-14 p-0.5 text-[10px] font-mono bg-transparent text-white focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-bold text-white/40 font-mono">P. Prom:</span>
                            <div className="flex items-center gap-0.5 bg-[#141414] px-1 rounded border border-white/5">
                              <span className="text-[10px] text-white/40">{settings.currencySymbol}</span>
                              <input
                                type="number"
                                value={quickPromoVal || ''}
                                onChange={(e) => setQuickPromoVal(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="Sin desc."
                                className="w-14 p-0.5 text-[10px] font-mono bg-transparent text-white focus:outline-none placeholder:text-white/20"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-1 pt-1 border-t border-white/5 mt-1">
                            <button
                              type="button"
                              onClick={() => setQuickEditId(null)}
                              className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] hover:bg-white/10 text-white/70 cursor-pointer"
                            >
                              No
                            </button>
                            <button
                              type="button"
                              onClick={() => saveQuickEdit(p.id)}
                              className="px-2 py-0.5 rounded bg-emerald-600 text-[9px] hover:bg-emerald-500 font-bold text-white cursor-pointer"
                            >
                              Savar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-black text-orange-500 font-mono">
                              {settings.currencySymbol}
                              {(hasDiscount ? p.promoPrice! : p.price).toLocaleString('es-AR')}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-white/40 line-through font-mono">
                                {settings.currencySymbol}
                                {p.price.toLocaleString('es-AR')}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => startQuickEdit(p)}
                            className="p-1 text-white/30 hover:text-orange-500 hover:bg-white/5 rounded transition-all cursor-pointer"
                            title="Modificar precio rápido"
                          >
                            <Edit2 size={10} />
                          </button>
                        </div>
                      )}

                      <div className="mt-2 text-[10px]">
                        <span className={`font-bold ${p.stock === 0 ? 'text-red-400' : p.stock <= 5 ? 'text-amber-400' : 'text-white/40'}`}>
                          Stock: {p.stock} u.
                        </span>
                      </div>
                    </div>

                    {/* Action buttons overlay */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#0F0F0F] p-1 rounded-lg border border-white/10">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PRICING & PROMOTIONS */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-sans font-bold text-lg text-white">Listado de Precios y Ofertas</h3>
              <p className="text-xs text-white/40">Edición rápida individual de precios y herramientas de recargo o descuento masivo.</p>
            </div>

            {/* Mass pricing adjustments panel */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-3">
                <label className="text-[10px] font-bold text-white/45 uppercase block mb-1">Tipo de Ajuste:</label>
                <select
                  value={massActionType}
                  onChange={(e: any) => setMassActionType(e.target.value)}
                  className="w-full p-2 text-xs bg-[#0F0F0F] border border-white/10 rounded-lg outline-none font-bold text-white focus:border-orange-500"
                >
                  <option value="surcharge">Aumento / Recargo (+%)</option>
                  <option value="discount">Rebaja / Descuento (-%)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-[10px] font-bold text-white/45 uppercase block mb-1">Categoría Objetivo:</label>
                <select
                  value={massTargetCategory}
                  onChange={(e: any) => setMassTargetCategory(e.target.value)}
                  className="w-full p-2 text-xs bg-[#0F0F0F] border border-white/10 rounded-lg outline-none font-bold text-white focus:border-orange-500"
                >
                  <option value="all">Todo el catálogo</option>
                  <option value="zapatillas">Zapatillas únicamente</option>
                  <option value="ropa">Ropa únicamente</option>
                  <option value="accesorios">Accesorios únicamente</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-[10px] font-bold text-white/45 uppercase block mb-1">Porcentaje (%):</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={massPercentage || ''}
                  onChange={(e) => setMassPercentage(Number(e.target.value))}
                  placeholder="Ej. 10"
                  className="w-full p-2 text-xs bg-[#0F0F0F] border border-white/10 rounded-lg outline-none font-mono font-bold text-white focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-3 flex gap-2">
                <button
                  onClick={handleApplyMassPricing}
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-wider text-[10px] rounded-lg active:scale-95 transition-all cursor-pointer text-center shadow-lg shadow-orange-600/15"
                >
                  Aplicar Ajuste
                </button>
                <button
                  onClick={() => handleClearDiscounts(massTargetCategory)}
                  className="p-2 border border-white/10 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-white/50 transition-colors cursor-pointer"
                  title="Limpiar Precios Promocionales"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Pricing Spreadsheet View */}
            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/45 font-black uppercase tracking-wider">
                    <th className="p-3">Ref/ID</th>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Precio Base</th>
                    <th className="p-3">Precio Oferta</th>
                    <th className="p-3">Descuento (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => {
                    const hasDiscount = p.promoPrice && p.promoPrice < p.price;
                    const discountValue = hasDiscount ? Math.round(((p.price - p.promoPrice!) / p.price) * 100) : 0;

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-white/30 font-semibold">#{p.id}</td>
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3 uppercase font-semibold text-white/50">{p.category}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-white/45">{settings.currencySymbol}</span>
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) => handlePriceFieldChange(p.id, Number(e.target.value))}
                              className="w-24 p-1 rounded-md border border-white/10 bg-[#0F0F0F] text-xs font-mono font-bold text-white focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-white/45">{settings.currencySymbol}</span>
                            <input
                              type="number"
                              value={p.promoPrice || ''}
                              onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                const updated = products.map(prod => prod.id === p.id ? { ...prod, promoPrice: val } : prod);
                                onUpdateProducts(updated);
                              }}
                              placeholder="Sin oferta"
                              className="w-24 p-1 rounded-md border border-white/10 bg-[#0F0F0F] text-xs font-mono font-bold text-white focus:border-orange-500 focus:outline-none placeholder:font-sans placeholder:font-normal placeholder:text-white/20"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          {hasDiscount ? (
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold font-mono text-[10px]">
                              -{discountValue}% OFF
                            </span>
                          ) : (
                            <span className="text-white/20 font-semibold">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STOCK CONTROL */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-lg text-white">Control de Stock e Inventario</h3>
              <p className="text-xs text-white/40">Verifique niveles de existencias físicas y realice ajustes directos con un solo clic.</p>
            </div>

            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/45 font-black uppercase tracking-wider">
                    <th className="p-3">Ref/ID</th>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Talles Disponibles</th>
                    <th className="p-3">Estado de Stock</th>
                    <th className="p-3 text-center">Unidades</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {products.map((p) => {
                    const statusClass = p.stock === 0 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : p.stock <= 5 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    
                    const statusText = p.stock === 0 
                      ? 'Agotado (Sin Stock)' 
                      : p.stock <= 5 
                        ? '¡Stock Crítico!' 
                        : 'Stock Saludable';

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-white/30 font-semibold">#{p.id}</td>
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {p.sizes.map(size => (
                              <span key={size} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/70">
                                {size}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${statusClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-extrabold text-sm text-white">{p.stock}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1 bg-black p-1 rounded-lg border border-white/10">
                            <button
                              onClick={() => handleAdjustStock(p.id, -1)}
                              className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white font-bold transition-all cursor-pointer w-6 h-6 flex items-center justify-center text-xs"
                              title="Restar 1 unidad"
                            >
                              -1
                            </button>
                            <span className="w-px border-r border-white/10 h-4" />
                            <button
                              onClick={() => handleAdjustStock(p.id, 1)}
                              className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white font-bold transition-all cursor-pointer w-6 h-6 flex items-center justify-center text-xs"
                              title="Sumar 1 unidad"
                            >
                              +1
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ADVERTISING BANNERS */}
        {activeTab === 'advertising' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-sans font-bold text-lg text-white">Publicidad y Banners Promocionales</h3>
              <p className="text-xs text-white/40">Administrá los banners deslizantes de la tienda para destacar liquidaciones, lanzamientos o envío gratuito.</p>
            </div>

            {/* Active banners cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b, index) => (
                <div key={b.id} className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                  {/* Banner image preview */}
                  <div className="h-36 relative bg-neutral-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-transparent z-10" />
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-y-0 left-0 p-4 flex flex-col justify-center text-white z-20">
                      {b.discountText && (
                        <span className="inline-block px-2 py-0.5 rounded bg-orange-600 text-white font-black text-[9px] uppercase tracking-wider mb-2 self-start">
                          {b.discountText}
                        </span>
                      )}
                      <h4 className="font-extrabold text-sm uppercase leading-tight">{b.title}</h4>
                      <p className="text-[10px] text-white/70 line-clamp-1 mt-1">{b.subtitle}</p>
                    </div>

                    <button
                      onClick={() => handleToggleBanner(index)}
                      className={`absolute top-3 right-3 z-20 px-2 py-1 rounded-md text-[9px] font-black uppercase border tracking-wider transition-all cursor-pointer ${
                        b.active 
                          ? 'bg-emerald-600 text-white border-emerald-500' 
                          : 'bg-[#0F0F0F] text-white/40 border-white/10'
                      }`}
                    >
                      {b.active ? 'Activo' : 'Pausado'}
                    </button>
                  </div>

                  {/* Edit Banner Form */}
                  <div className="p-4 bg-white/[0.02] flex-1 space-y-3">
                    {editingBannerIndex === index ? (
                      <div className="space-y-3 pt-1 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-white/45 block uppercase mb-1">Título principal:</label>
                            <input
                              type="text"
                              value={bTitle}
                              onChange={(e) => setBTitle(e.target.value)}
                              className="w-full p-1.5 text-xs bg-[#0F0F0F] border border-white/10 rounded-md outline-none text-white focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-white/45 block uppercase mb-1">Etiqueta Promo:</label>
                            <input
                              type="text"
                              value={bDiscountText}
                              onChange={(e) => setBDiscountText(e.target.value)}
                              placeholder="Ej. 25% OFF"
                              className="w-full p-1.5 text-xs bg-[#0F0F0F] border border-white/10 rounded-md outline-none text-white focus:border-orange-500 placeholder:text-white/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-white/45 block uppercase mb-1">Subtítulo/Descripción:</label>
                          <input
                            type="text"
                            value={bSubtitle}
                            onChange={(e) => setBSubtitle(e.target.value)}
                            className="w-full p-1.5 text-xs bg-[#0F0F0F] border border-white/10 rounded-md outline-none text-white focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-white/45 block uppercase mb-1">URL Imagen publicitaria:</label>
                          <input
                            type="text"
                            value={bImage}
                            onChange={(e) => setBImage(e.target.value)}
                            className="w-full p-1.5 text-xs bg-[#0F0F0F] border border-white/10 rounded-md outline-none font-mono text-white focus:border-orange-500"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => setEditingBannerIndex(null)}
                            className="px-3 py-1.5 border border-white/10 rounded-lg text-white/60 text-xs font-bold hover:bg-white/5 transition-all cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveBanner}
                            className="px-4 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-orange-500 transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-orange-600/15"
                          >
                            <Save size={12} />
                            Guardar Banner
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs">
                        <div className="text-white/50 font-semibold">
                          Enlace: <span className="text-orange-500 uppercase font-bold">{b.linkToCategory === 'all' ? 'Ver todo' : b.linkToCategory}</span>
                        </div>
                        <button
                          onClick={() => handleOpenEditBanner(index)}
                          className="px-3 py-1.5 border border-white/10 hover:border-orange-500/30 rounded-lg text-white/80 font-bold transition-all flex items-center gap-1 cursor-pointer hover:bg-white/5"
                        >
                          <Edit2 size={11} />
                          Editar Diseño
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GENERAL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-lg text-white">Parámetros del Negocio</h3>
              <p className="text-xs text-white/40">Establezca los datos esenciales de su comercio electrónico y pasarela de cobros.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Name */}
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Nombre de la Tienda:</label>
                  <input
                    type="text"
                    name="storeName"
                    defaultValue={settings.storeName}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-bold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Teléfono WhatsApp Recibidor (Formato Internacional):</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    defaultValue={settings.whatsappNumber}
                    required
                    placeholder="Ej. 5491133445566 (sin el + ni espacios)"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-mono text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                  <span className="text-[10px] text-white/30 mt-1 block">
                    ⚠️ Debe incluir código de país completo para abrir la mensajería directo (por ej: 54 para Argentina, 911 para CABA).
                  </span>
                </div>

                {/* Currency & Base delivery cost */}
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Símbolo Monetario / Divisa:</label>
                  <input
                    type="text"
                    name="currencySymbol"
                    defaultValue={settings.currencySymbol}
                    required
                    maxLength={3}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-bold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Costo Base de Envío a Domicilio:</label>
                  <input
                    type="number"
                    name="deliveryCost"
                    defaultValue={settings.deliveryCost}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-mono font-bold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                {/* Free Delivery threshold */}
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Umbral para Envío Gratis (Min. de compra):</label>
                  <input
                    type="number"
                    name="freeDeliveryThreshold"
                    defaultValue={settings.freeDeliveryThreshold || ''}
                    placeholder="Dejar vacío para desactivar"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-mono font-bold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-white/20"
                  />
                </div>

                {/* Local Physical Address */}
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Dirección de Sucursal (para Retiros):</label>
                  <input
                    type="text"
                    name="storeAddress"
                    defaultValue={settings.storeAddress}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                {/* Mercado Pago Credentials simulation */}
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Alias Mercado Pago (Recibir Transferencias):</label>
                  <input
                    type="text"
                    name="mercadoPagoAlias"
                    defaultValue={settings.mercadoPagoAlias}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-bold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">C.V.U. de Cuenta Mercado Pago:</label>
                  <input
                    type="text"
                    name="mercadoPagoCvu"
                    defaultValue={settings.mercadoPagoCvu}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0F0F0F] text-xs font-mono font-bold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Toggle switch for simulated checkout payment gateway */}
              <div className="p-4 bg-orange-600/10 rounded-xl border border-orange-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-orange-400 block uppercase tracking-wider">Simulador de Mercado Pago Activo</span>
                  <span className="text-[11px] text-white/60 block mt-0.5">
                    Permite a los usuarios realizar un checkout interactivo de simulación con tarjeta o código QR antes de enviar el voucher por WhatsApp.
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <select
                    name="enableSimulator"
                    defaultValue={settings.enableMercadoPagoSimulator ? 'true' : 'false'}
                    className="w-full sm:w-auto p-1.5 text-xs bg-[#0F0F0F] border border-white/10 rounded-lg outline-none font-bold text-white cursor-pointer"
                  >
                    <option value="true">Activado (Recomendado)</option>
                    <option value="false">Desactivado (Directo a WhatsApp)</option>
                  </select>
                </div>
              </div>

              {/* Actions submit */}
              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-orange-600/20 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  Guardar Parámetros
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: RECEIVED ORDERS LOGS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="font-sans font-bold text-lg text-white">Registro de Pedidos Recibidos</h3>
                <p className="text-xs text-white/40">Monitoreá las órdenes procesadas por tus clientes en esta sesión de prueba.</p>
              </div>
              {orders.length > 0 && (
                <button
                  onClick={onClearOrders}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Limpiar Registro
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-white/40">Aún no se han recibido pedidos en esta sesión.</p>
                <p className="text-xs text-white/20 mt-1">Realizá una compra de prueba desde el catálogo para ver el registro aquí.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {orders.map((o) => {
                  const statusClass = o.status === 'aprobado' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                  return (
                    <div key={o.id} className="p-4 rounded-xl border border-white/5 bg-white/5 text-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-start relative hover:border-white/10 transition-colors">
                      <div className="md:col-span-3">
                        <span className="font-mono font-bold text-white/30 block">#{o.id}</span>
                        <span className="font-bold text-white block text-sm mt-0.5">{o.customerName}</span>
                        <span className="text-white/40 font-mono text-[10px] block mt-0.5">
                          {new Date(o.createdAt).toLocaleString('es-AR')}
                        </span>
                      </div>

                      {/* Items summaries */}
                      <div className="md:col-span-4 space-y-1">
                        <span className="text-[10px] text-white/40 font-bold uppercase block">Detalle:</span>
                        {o.items.map((it, idx) => (
                          <div key={idx} className="font-semibold text-white/80">
                            <span className="text-orange-500 mr-1">•</span> {it.quantity}x {it.productName} <span className="text-white/40">(Talle: {it.size}{it.color ? `, Color: ${it.color}` : ''})</span>
                          </div>
                        ))}
                      </div>

                      {/* Info and Delivery Details */}
                      <div className="md:col-span-3 space-y-1">
                        <span className="text-[10px] text-white/40 font-bold uppercase block">Destino y Pago:</span>
                        <div className="text-white/80 capitalize font-medium">{o.deliveryType === 'envio' ? 'Envío' : 'Retiro'}</div>
                        <div className="text-[10px] text-white/50 truncate max-w-[180px]" title={o.customerAddress}>
                          {o.customerAddress}
                        </div>
                        <div className="text-orange-400 font-extrabold uppercase text-[9px] mt-1 flex items-center gap-1">
                          Método: {o.paymentMethod.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Total and Status */}
                      <div className="md:col-span-2 text-right self-center">
                        <span className="text-lg font-black text-white font-mono block">
                          {settings.currencySymbol}
                          {o.total.toLocaleString('es-AR')}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-wider mt-1.5 ${statusClass}`}>
                          {o.status === 'aprobado' ? 'PAGO RECIBIDO' : 'PENDIENTE CONFIRM.'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: MARKETING & WHATSAPP AUTOMATION */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest px-2 py-1 rounded bg-orange-600/10 border border-orange-500/15">Automatización & IA</span>
              <h3 className="font-sans font-bold text-xl text-white mt-3">Portal de Marketing y WhatsApp Completo</h3>
              <p className="text-xs text-white/50 mt-1">
                Comunique promociones por WhatsApp, diseñe perfiles publicitarios de venta textil y organice el programa de notificaciones automáticas para sus clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left Column: Broadcast Promo & Triggers Configuration (8 cols) */}
              <div className="xl:col-span-8 space-y-6">
                
                {/* Module A: Campaña de Difusión de WhatsApp */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Phone size={18} />
                    <h4 className="font-bold text-sm uppercase tracking-wider text-white">1. Generador de Difusión por WhatsApp</h4>
                  </div>
                  <p className="text-[11px] text-white/50">
                    Seleccione un producto, defina la oferta e interactúe con la Inteligencia Artificial para obtener un copy optimizado listo para enviar por WhatsApp.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Select Product */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Prenda o Calzado a Promocionar:</label>
                      <select
                        value={broadcastProduct}
                        onChange={(e) => setBroadcastProduct(e.target.value)}
                        className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 font-bold"
                      >
                        <option value="all">Todo el Catálogo / Ofertas generales</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            [{p.category.toUpperCase()}] {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Campaign Objective */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Objetivo del Mensaje:</label>
                      <select
                        value={broadcastObjective}
                        onChange={(e) => setBroadcastObjective(e.target.value)}
                        className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 font-bold"
                      >
                        <option value="descuento_flash">Descuento Flash de 24 Horas ⚡</option>
                        <option value="lanzamiento">Lanzamiento Nueva Colección ✨</option>
                        <option value="liquidacion">Liquidación Crítica de Stock 📦</option>
                        <option value="bienvenida">Beneficio de Bienvenida / Fidelización 👋</option>
                      </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Porcentaje de Descuento:</label>
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={broadcastDiscount}
                        onChange={(e) => setBroadcastDiscount(Number(e.target.value))}
                        placeholder="Ej. 15 o 30"
                        className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-xs font-mono font-bold text-white focus:border-orange-500"
                      />
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Notas de Enfoque Adicional:</label>
                      <input
                        type="text"
                        value={broadcastAddInfo}
                        onChange={(e) => setBroadcastAddInfo(e.target.value)}
                        placeholder="Ej: 'Solo para clientes frecuentes', 'Estilo Streetwear'"
                        className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleGenerateCopy('broadcast')}
                      disabled={isGeneratingBroadcast}
                      className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isGeneratingBroadcast ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Generando con Gemini...
                        </>
                      ) : (
                        <>
                          <TrendingUp size={14} />
                          Generar Mensaje con IA 🚀
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Campaign Mock */}
                  {generatedBroadcastMessage && (
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Simulación de Recepción en WhatsApp Web:</span>
                      <div className="bg-[#0b141a] p-4 rounded-2xl border border-[#202c33] max-w-lg shadow-inner">
                        {/* WhatsApp balloon card */}
                        <div className="bg-[#005c4b] text-white p-3.5 rounded-xl rounded-tl-none text-xs leading-relaxed font-sans relative shadow-sm">
                          {/* Triangle element */}
                          <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-[#005c4b] border-l-[8px] border-l-transparent"></div>
                          <pre className="whitespace-pre-wrap font-sans break-words text-white/95">{generatedBroadcastMessage}</pre>
                          <div className="text-right text-[9px] text-white/50 mt-2 font-mono">
                            {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} ✓✓
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedBroadcastMessage);
                            setBroadcastCopied(true);
                            setTimeout(() => setBroadcastCopied(false), 2000);
                          }}
                          className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-white/5"
                        >
                          {broadcastCopied ? (
                            <>
                              <CheckCircle size={13} className="text-emerald-400" />
                              <span className="text-emerald-400">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Save size={13} />
                              Copiar Mensaje
                            </>
                          )}
                        </button>

                        <a
                          href={`https://web.whatsapp.com/send?text=${encodeURIComponent(generatedBroadcastMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black uppercase text-[10px] tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Phone size={13} />
                          Enviar por WhatsApp Web 📲
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module B: Automatizaciones de Mensajes (Programa Conexión) */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Layers size={18} />
                    <h4 className="font-bold text-sm uppercase tracking-wider text-white">2. Programa de Automatización al Conectar con WhatsApp</h4>
                  </div>
                  <p className="text-[11px] text-white/50">
                    Defina los mensajes automáticos que se compilan para el cliente en los diferentes estados de su orden de compra.
                  </p>

                  <div className="space-y-4 pt-1">
                    {/* Trigger 1: Confirmación de Compra */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-white/60 uppercase">Disparador: Confirmación del Pedido 🛍️</span>
                        <span className="text-[9px] font-mono text-white/30">Variables: {'{CLIENTE}'}, {'{PEDIDO_ID}'}, {'{PRODUCTOS}'}, {'{TOTAL}'}</span>
                      </div>
                      <textarea
                        value={notifOrderConfirm}
                        onChange={(e) => setNotifOrderConfirm(e.target.value)}
                        rows={2}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs text-white font-sans outline-none focus:border-orange-500 leading-normal"
                      />
                    </div>

                    {/* Trigger 2: Pago Pendiente Transferencia/Mercado Pago */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-white/60 uppercase">Disparador: Pago Pendiente (Alias/MP) 🏦</span>
                        <span className="text-[9px] font-mono text-white/30">Variables: {'{CLIENTE}'}, {'{PEDIDO_ID}'}, {'{TOTAL}'}, {'{ALIAS_MP}'}</span>
                      </div>
                      <textarea
                        value={notifPendingPayment}
                        onChange={(e) => setNotifPendingPayment(e.target.value)}
                        rows={2}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs text-white font-sans outline-none focus:border-orange-500 leading-normal"
                      />
                    </div>

                    {/* Trigger 3: Pedido Despachado / Envío en camino */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-white/60 uppercase">Disparador: Pedido Despachado 🚚</span>
                        <span className="text-[9px] font-mono text-white/30">Variables: {'{CLIENTE}'}, {'{PEDIDO_ID}'}, {'{DIRECCION}'}, {'{PRODUCTOS}'}</span>
                      </div>
                      <textarea
                        value={notifShipped}
                        onChange={(e) => setNotifShipped(e.target.value)}
                        rows={2}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs text-white font-sans outline-none focus:border-orange-500 leading-normal"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveTemplates}
                        className="w-full sm:w-auto px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save size={12} />
                        Guardar Plantillas de Automatización 💾
                      </button>
                    </div>
                  </div>

                  {/* Interactive Dynamic Preview */}
                  <div className="bg-[#0F0F0F] p-4 rounded-xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">Demostración de Compilación en Tiempo Real:</span>
                    <p className="text-[11px] text-white/50">
                      Vea cómo se vería el mensaje disparado automáticamente usando datos de ejemplo (Cliente: Juan Pérez, Pedido: #1043, Total: {settings.currencySymbol}45.000):
                    </p>
                    <div className="bg-[#0b141a] p-3 rounded-lg border border-[#202c33]">
                      <div className="bg-[#202c33] text-white p-3 rounded-xl rounded-tl-none text-xs max-w-md">
                        <pre className="whitespace-pre-wrap font-sans break-words text-white/90">
                          {notifOrderConfirm
                            .replace(/{CLIENTE}/g, 'Juan Pérez')
                            .replace(/{PEDIDO_ID}/g, '1043')
                            .replace(/{PRODUCTOS}/g, '1x Zapatilla Pegasus 40 (42)')
                            .replace(/{TOTAL}/g, `${settings.currencySymbol}45.000`)
                            .replace(/{ALIAS_MP}/g, settings.mercadoPagoAlias)
                          }
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module D: Optimización de Múltiples Ángulos Publicitarios y Campañas Interactivas */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2 text-orange-400">
                      <Sparkles size={18} />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-white">4. Multi-Ángulos IA & Campaña Interactiva</h4>
                    </div>
                    <span className="text-[9px] font-bold bg-orange-600/10 text-orange-500 border border-orange-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Nuevo: Interactivo</span>
                  </div>
                  
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Maximice sus conversiones generando 4 perspectivas de venta distintas (AIDA, PAS, Estilo de Vida y Guion Viral). Luego, publique la campaña de inmediato para que los clientes interactúen con ella de forma dinámica en la página web.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0F0F0F] p-4 rounded-xl border border-white/5">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Prenda o Zapatilla Clave:</label>
                      <select
                        value={anglesProduct}
                        onChange={(e) => setAnglesProduct(e.target.value)}
                        className="w-full p-2 bg-[#151515] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 font-bold"
                      >
                        <option value="all">Todo el Catálogo / General</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            [{p.category.toUpperCase()}] {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">% Descuento de Gancho:</label>
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={anglesDiscount}
                        onChange={(e) => setAnglesDiscount(Number(e.target.value))}
                        className="w-full p-2 bg-[#151515] border border-white/10 rounded-lg outline-none text-xs font-mono font-bold text-white focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Atributos Extra (Material, Textura):</label>
                      <input
                        type="text"
                        value={anglesAddInfo}
                        onChange={(e) => setAnglesAddInfo(e.target.value)}
                        placeholder="Ej. Algodón peinado, Cuero rústico, Envío Express"
                        className="w-full p-2 bg-[#151515] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateAngles}
                      disabled={isGeneratingAngles}
                      className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isGeneratingAngles ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Generando Ángulos con Gemini...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          Generar 4 Ángulos Publicitarios con IA 🚀
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Multi-Angle Showcase */}
                  {generatedAnglesText && (
                    <div className="space-y-4 pt-3 border-t border-white/5">
                      <div className="bg-[#0D0D0D] p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block">📋 Portafolio de Ángulos de Venta Generados:</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedAnglesText);
                              setAnglesCopied(true);
                              setTimeout(() => setAnglesCopied(false), 2000);
                            }}
                            className="text-[10px] font-extrabold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {anglesCopied ? '¡Copiado Todo!' : 'Copiar Todo'}
                          </button>
                        </div>
                        
                        <div className="p-3.5 bg-[#080808] rounded-xl border border-white/5 text-xs text-white/90 max-h-[300px] overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                          {generatedAnglesText}
                        </div>
                      </div>

                      {/* Storefront Integration Controls */}
                      <div className="bg-[#121212] p-4 rounded-xl border border-orange-500/20 space-y-4 shadow-lg shadow-orange-500/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
                            <h5 className="font-bold text-xs text-orange-400 uppercase tracking-wider">Publicar Campaña Interactiva en Tienda</h5>
                          </div>
                          
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isPromoPublished}
                              onChange={(e) => setIsPromoPublished(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-[#252525] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                            <span className="ml-2 text-[10px] font-bold text-white/60 uppercase">
                              {isPromoPublished ? 'ACTIVA 🟢' : 'INACTIVA 🔴'}
                            </span>
                          </label>
                        </div>

                        <p className="text-[10px] text-white/40 leading-normal">
                          Cuando activa esta sección, se creará un banner interactivo especial e interactividad de estilo para los clientes visitantes en tiempo real en la tienda.
                        </p>

                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div>
                            <label className="text-[9px] font-bold text-white/40 uppercase block mb-1">Título de la Campaña:</label>
                            <input
                              type="text"
                              value={publishedPromoTitle}
                              onChange={(e) => setPublishedPromoTitle(e.target.value)}
                              className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-white focus:border-orange-500 font-bold"
                              placeholder="Ej: 🔥 SÚPER PROMO: 15% OFF + ENVÍO GRATIS"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-white/40 uppercase block mb-1">Mensaje Persuasivo Publicitario:</label>
                            <textarea
                              value={publishedPromoText}
                              onChange={(e) => setPublishedPromoText(e.target.value)}
                              rows={2.5}
                              className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-white focus:border-orange-500 leading-normal"
                              placeholder="Escriba el gancho que verá el cliente..."
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-[9px] text-white/40 font-mono">ID de Categoría: <strong className="text-orange-500">{anglesProduct}</strong> | Descuento: <strong className="text-orange-500">{anglesDiscount}%</strong></span>
                          <button
                            type="button"
                            onClick={handlePublishPromo}
                            className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Save size={12} />
                            Actualizar Campaña en Tienda 💾
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Advertising Profile & Demographics (4 cols) */}
              <div className="xl:col-span-4 space-y-6">
                
                {/* Module C: Perfil Publicitario e Informe de Segmentación */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <ImageIcon size={18} />
                    <h4 className="font-bold text-sm uppercase tracking-wider text-white">3. Perfil Publicitario Digital</h4>
                  </div>
                  <p className="text-[11px] text-white/50">
                    Cree un plan de marketing estratégico para redes sociales adaptado para ropa, zapatillas y productos textiles.
                  </p>

                  <div className="space-y-3">
                    {/* Category */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Categoría Textil:</label>
                      <select
                        value={adCategory}
                        onChange={(e) => setAdCategory(e.target.value)}
                        className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 font-bold"
                      >
                        <option value="all">Todo el Catálogo</option>
                        <option value="playeras">Playeras 👕</option>
                        <option value="pantalones">Pantalones 👖</option>
                        <option value="jeans">Jeans 👖</option>
                        <option value="sudaderas">Sudaderas 🧥</option>
                        <option value="camisolas">Camisolas 👔</option>
                        <option value="zapatillas">Zapatillas 👟</option>
                      </select>
                    </div>

                    {/* Campaign Goal */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Objetivo del Perfil:</label>
                      <select
                        value={adObjective}
                        onChange={(e) => setAdObjective(e.target.value)}
                        className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none text-xs text-white focus:border-orange-500 font-bold"
                      >
                        <option value="venta_directa">Venta Directa de Catálogo 💰</option>
                        <option value="crecimiento_marca">Crecimiento de Marca e Imagen 📈</option>
                        <option value="interaccion_whatsapp">Interacción y Cierre por WhatsApp 💬</option>
                      </select>
                    </div>

                    {/* Demographics Notes */}
                    <div>
                      <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Estilo o Público Particular:</label>
                      <textarea
                        value={adAudienceNotes}
                        onChange={(e) => setAdAudienceNotes(e.target.value)}
                        placeholder="Ej. Streetwear, calzado deportivo de alta gama, telas de algodón puro"
                        rows={3}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-white/10 rounded-lg text-xs text-white outline-none focus:border-orange-500 leading-normal"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateCopy('ad_profile')}
                      disabled={isGeneratingAdProfile}
                      className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isGeneratingAdProfile ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} />
                          Generar Plan de Marketing 📈
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Advertising Dossier */}
                  {generatedAdProfile && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Dosier Publicitario:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedAdProfile);
                            setAdProfileCopied(true);
                            setTimeout(() => setAdProfileCopied(false), 2000);
                          }}
                          className="text-[10px] font-extrabold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {adProfileCopied ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <div className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 text-[11px] leading-relaxed text-white/90 max-h-[350px] overflow-y-auto font-mono whitespace-pre-wrap">
                        {generatedAdProfile}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* 4. MODAL: ADD/EDIT PRODUCT */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-[#111111] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h4 className="font-sans font-bold text-base text-white">
                  {editingProduct ? 'Editar Producto del Catálogo' : 'Agregar Nuevo Producto'}
                </h4>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* ID, Category, Subcategory */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">ID Único Referencia:</label>
                    <input
                      type="text"
                      required
                      value={pId}
                      onChange={(e) => setPId(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                      disabled={!!editingProduct}
                      placeholder="Ej. zap-retro-01"
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-mono font-bold disabled:bg-white/5 disabled:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Categoría del Producto:</label>
                    <select
                      value={pCategory}
                      onChange={(e: any) => {
                        const cat = e.target.value;
                        setPCategory(cat);
                        if (cat === 'zapatillas') {
                          setPSubcategory('zapatillas');
                        } else if (cat === 'accesorios') {
                          setPSubcategory('');
                        }
                      }}
                      className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none font-bold text-white focus:border-orange-500"
                    >
                      <option value="zapatillas">Zapatillas / Calzado</option>
                      <option value="ropa">Ropa / Textil</option>
                      <option value="accesorios">Accesorios</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Subcategoría:</label>
                    <select
                      value={pSubcategory}
                      onChange={(e) => setPSubcategory(e.target.value)}
                      className="w-full p-2 bg-[#0F0F0F] border border-white/10 rounded-lg outline-none font-bold text-white focus:border-orange-500"
                    >
                      <option value="">Ninguna / No aplica</option>
                      <option value="zapatillas">Zapatillas 👟</option>
                      <option value="playeras">Playeras / Remeras 👕</option>
                      <option value="pantalones">Pantalones 👖</option>
                      <option value="jeans">Jeans Denim 👖</option>
                      <option value="sudaderas">Sudaderas / Buzos 🧥</option>
                      <option value="camisolas">Camisolas / Camisas 👔</option>
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Nombre Completo del Producto:</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Ej. Zapatillas Nike Air Pegasus 40"
                    className="w-full p-2.5 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-bold placeholder:text-white/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Descripción Detallada:</label>
                  <textarea
                    required
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="Contá las características, calce, materiales de fabricación, etc..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 leading-relaxed font-sans placeholder:text-white/20"
                  />
                </div>

                {/* Price and Promo Price and Stock */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Precio Base ({settings.currencySymbol}):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={pPrice || ''}
                      onChange={(e) => setPPrice(Number(e.target.value))}
                      placeholder="85000"
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-mono font-bold placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Precio Oferta (Opcional):</label>
                    <input
                      type="number"
                      min="1"
                      value={pPromoPrice || ''}
                      onChange={(e) => setPPromoPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Solo si tiene rebaja"
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-mono font-bold placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Stock Inicial (Unidades):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={pStock}
                      onChange={(e) => setPStock(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Sizes and Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Talles (Separados por coma):</label>
                    <input
                      type="text"
                      required
                      value={pSizes}
                      onChange={(e) => setPSizes(e.target.value)}
                      placeholder="Ej. 39, 40, 41, 42, 43 o S, M, L, XL"
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-semibold placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Colores (Separados por coma):</label>
                    <input
                      type="text"
                      value={pColors}
                      onChange={(e) => setPColors(e.target.value)}
                      placeholder="Ej. Negro, Blanco, Rojo"
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-semibold placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* Product Image URL */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">URL de la Imagen de Producto:</label>
                  <input
                    type="text"
                    required
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://ejemplo.com/zapatilla.jpg"
                    className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-mono placeholder:text-white/20"
                  />
                </div>

                {/* Tags and Featured toggle */}
                <div className="grid grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-white/40 block uppercase mb-1">Etiquetas/Badges (Separados por coma):</label>
                    <input
                      type="text"
                      value={pTags}
                      onChange={(e) => setPTags(e.target.value)}
                      placeholder="Ej. Más Vendido, Nuevo, 15% OFF"
                      className="w-full p-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white outline-none focus:border-orange-500 font-semibold placeholder:text-white/20"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={pFeatured}
                      onChange={(e) => setPFeatured(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs font-bold text-white/70 cursor-pointer select-none">
                      Destacar producto en Portada
                    </label>
                  </div>
                </div>

                {/* Action Submit Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-white/10 text-white/70 hover:bg-white/5 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-600/15"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
