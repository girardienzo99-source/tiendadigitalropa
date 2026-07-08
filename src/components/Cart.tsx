import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, MapPin, Phone, User, MessageCircle, CreditCard, ChevronRight } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface CartProps {
  cartItems: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onOpenMercadoPago: (orderDetails: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryType: 'envio' | 'takeaway';
    paymentMethod: 'mercado_pago' | 'transferencia' | 'efectivo';
    total: number;
    subtotal: number;
    deliveryCost: number;
    onSuccess: (paymentId: string) => void;
  }) => void;
  onRegisterOrder: (order: any) => void;
}

export default function Cart({
  cartItems,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenMercadoPago,
  onRegisterOrder,
}: CartProps) {
  // Form States
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'envio' | 'takeaway'>('envio');
  const [paymentMethod, setPaymentMethod] = useState<'mercado_pago' | 'transferencia' | 'efectivo'>('mercado_pago');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<'alias' | 'cvu' | null>(null);

  // Calculation details
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.promoPrice && item.product.promoPrice < item.product.price
      ? item.product.promoPrice
      : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const isFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const deliveryCost = deliveryType === 'takeaway' ? 0 : (isFreeDelivery ? 0 : settings.deliveryCost);
  const total = subtotal + deliveryCost;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.customerName = 'Ingresá tu nombre completo';
    if (!customerPhone.trim()) {
      errors.customerPhone = 'Ingresá tu teléfono para el contacto';
    } else if (customerPhone.replace(/\D/g, '').length < 8) {
      errors.customerPhone = 'Ingresá un teléfono válido';
    }
    if (deliveryType === 'envio' && !customerAddress.trim()) {
      errors.customerAddress = 'Ingresá la dirección de envío';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper to trigger real WhatsApp message forwarding
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'mercado_pago' && settings.enableMercadoPagoSimulator) {
      // Open the interactive simulated Mercado Pago payment interface
      onOpenMercadoPago({
        customerName,
        customerPhone,
        customerAddress,
        deliveryType,
        paymentMethod,
        total,
        subtotal,
        deliveryCost,
        onSuccess: (paymentId) => {
          // Callback after successful simulated payment
          sendWhatsAppOrderMessage(paymentId);
          // Register order in history
          registerCompletedOrder(paymentId, 'aprobado');
          onClearCart();
        }
      });
    } else {
      // Normal flow (Bank Transfer or Cash) or standard redirection
      const orderId = `PED-${Math.floor(100000 + Math.random() * 900000)}`;
      sendWhatsAppOrderMessage(orderId);
      registerCompletedOrder(orderId, 'pendiente');
      onClearCart();
    }
  };

  const registerCompletedOrder = (orderId: string, status: 'pendiente' | 'aprobado') => {
    const newOrder = {
      id: orderId,
      customerName,
      customerPhone,
      customerAddress: deliveryType === 'envio' ? customerAddress : 'Retiro por Sucursal',
      deliveryType,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.promoPrice || item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      })),
      subtotal,
      deliveryCost,
      discount: 0,
      total,
      status,
      createdAt: new Date().toISOString()
    };
    onRegisterOrder(newOrder);
  };

  const sendWhatsAppOrderMessage = (paymentReference: string) => {
    const formattedDate = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let itemsText = '';
    cartItems.forEach((item, index) => {
      const price = item.product.promoPrice || item.product.price;
      const details = [
        item.selectedSize ? `Talle: ${item.selectedSize}` : null,
        item.selectedColor ? `Color: ${item.selectedColor}` : null,
      ].filter(Boolean).join(', ');
      
      itemsText += `• ${item.quantity}x ${item.product.name} (${details}) - ${settings.currencySymbol}${price.toLocaleString('es-AR')}/u\n`;
    });

    const deliveryText = deliveryType === 'envio'
      ? `🚚 *Envío a Domicilio*\n📍 *Dirección:* ${customerAddress}`
      : `🏪 *Retiro por Sucursal (Takeaway)*\n📍 *Lugar:* ${settings.storeAddress}`;

    const paymentText = paymentMethod === 'mercado_pago'
      ? `💳 *Mercado Pago* (Ref: ${paymentReference})`
      : paymentMethod === 'transferencia'
        ? `🏦 *Transferencia Bancaria* (Alias/CVU: ${settings.mercadoPagoAlias})`
        : `💵 *Efectivo / Contraentrega*`;

    // Compile dynamic intro template if configured
    const productsSummary = cartItems.map(item => `${item.quantity}x ${item.product.name}`).join(', ');
    const formattedTotal = `${settings.currencySymbol}${total.toLocaleString('es-AR')}`;

    let customTemplate = '';
    if (paymentMethod === 'transferencia' && settings.notifPendingPayment) {
      customTemplate = settings.notifPendingPayment;
    } else if (settings.notifOrderConfirm) {
      customTemplate = settings.notifOrderConfirm;
    }

    let introText = '';
    if (customTemplate) {
      introText = customTemplate
        .replace(/{CLIENTE}/g, customerName)
        .replace(/{PEDIDO_ID}/g, paymentReference)
        .replace(/{PRODUCTOS}/g, productsSummary)
        .replace(/{TOTAL}/g, formattedTotal)
        .replace(/{ALIAS_MP}/g, settings.mercadoPagoAlias)
        .replace(/{DIRECCION}/g, deliveryType === 'envio' ? customerAddress : 'Retiro por Sucursal')
        + '\n\n';
    }

    const rawMessage = 
`${introText}🛍️ *DETALLE DE ORDEN - ${settings.storeName}*
📅 _Fecha: ${formattedDate}_
-----------------------------------------
👤 *Cliente:* ${customerName}
📞 *Contacto:* ${customerPhone}
${deliveryText}

🛒 *Detalle del Pedido:*
${itemsText}
-----------------------------------------
💰 *Subtotal:* ${settings.currencySymbol}${subtotal.toLocaleString('es-AR')}
🚚 *Costo de Envío:* ${deliveryCost === 0 ? '¡GRATIS!' : `${settings.currencySymbol}${deliveryCost.toLocaleString('es-AR')}`}
💵 *TOTAL GENERAL:* ${formattedTotal}

💳 *Forma de Pago:* ${paymentText}
-----------------------------------------
📌 _Por favor, confirmame la recepción de este pedido y los detalles de entrega. ¡Muchas gracias!_`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    
    // Open in new tab securely
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (cartItems.length === 0) {
    return (
      <div id="cart-empty-view" className="flex flex-col items-center justify-center py-16 text-center bg-[#111113] border border-white/5 rounded-3xl p-8">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 mb-4 shadow-inner">
          <ShoppingBag size={36} />
        </div>
        <h3 className="font-sans font-black text-lg text-white mb-2 uppercase tracking-tight italic">Tu carrito está vacío</h3>
        <p className="text-xs text-white/50 max-w-xs mb-6 leading-relaxed">
          Explorá nuestro catálogo de calzado y textiles y agregá tus productos favoritos para armar tu pedido.
        </p>
      </div>
    );
  }

  return (
    <div id="cart-active-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items List (Left Side - 7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-orange-500" />
            Productos ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </h3>
          <button
            onClick={onClearCart}
            className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            Vaciar Carrito
          </button>
        </div>

        <div className="max-h-[480px] overflow-y-auto pr-2 space-y-3">
          {cartItems.map((item, index) => {
            const hasDiscount = item.product.promoPrice && item.product.promoPrice < item.product.price;
            const itemPrice = hasDiscount ? item.product.promoPrice! : item.product.price;
            const itemTotal = itemPrice * item.quantity;

            return (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-black overflow-hidden relative shrink-0 border border-white/10">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-bold text-sm text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1 mb-2">
                    {item.selectedSize && (
                      <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-white/80 font-bold text-[10px] uppercase border border-white/10">
                        Talle: {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-white/80 font-bold text-[10px] uppercase border border-white/10">
                        Color: {item.selectedColor}
                      </span>
                    )}
                  </div>

                  {/* Quantity and Price row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-lg border border-white/10 px-1 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-1 text-white/60 hover:text-white active:scale-90 transition-all rounded-md"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className={`p-1 rounded-md transition-all ${
                          item.quantity >= item.product.stock
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white/60 hover:text-white active:scale-90'
                        }`}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-[10px] text-white/40">
                        {item.quantity} x {settings.currencySymbol}{itemPrice.toLocaleString('es-AR')}
                      </span>
                      <span className="block font-bold text-sm text-white font-sans font-mono">
                        {settings.currencySymbol}{itemTotal.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(index)}
                  className="p-1 text-white/40 hover:text-red-400 self-start transition-colors cursor-pointer"
                  aria-label="Quitar del carrito"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Free Shipping Announcement */}
        {settings.freeDeliveryThreshold && (
          <div className="bg-[#111111] rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <span className="text-xs text-white/70">
              {isFreeDelivery ? (
                <strong className="text-emerald-400 flex items-center gap-1">
                  🎉 ¡Tu pedido tiene Envío Gratis!
                </strong>
              ) : (
                <>
                  Agregá <strong className="text-orange-500 font-mono">{settings.currencySymbol}{(settings.freeDeliveryThreshold - subtotal).toLocaleString('es-AR')}</strong> más para conseguir <strong className="text-orange-500">Envío Gratis</strong>
                </>
              )}
            </span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full transition-all duration-500 ${isFreeDelivery ? 'bg-emerald-500 w-full' : 'bg-orange-600'}`}
                style={{ width: `${Math.min((subtotal / settings.freeDeliveryThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form & Pricing Summary (Right Side - 5 Cols) */}
      <div className="lg:col-span-5 bg-[#111111] border border-white/5 rounded-2xl p-5 md:p-6 shadow-2xl">
        <h3 className="font-sans font-black text-lg text-white mb-4 pb-2 border-b border-white/10 uppercase italic tracking-tight">
          Datos de Entrega y Pago
        </h3>

        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="text-xs font-bold text-white/60 block mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-orange-500" />
              Nombre Completo:
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej. Enzo Girardi"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-sm outline-none transition-all placeholder-white/25 focus:bg-[#151515] ${
                formErrors.customerName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'
              }`}
            />
            {formErrors.customerName && (
              <span className="text-[10px] text-red-400 font-semibold mt-1 block">{formErrors.customerName}</span>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="text-xs font-bold text-white/60 block mb-1.5 flex items-center gap-1.5">
              <Phone size={13} className="text-orange-500" />
              Teléfono / WhatsApp:
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Ej. +54 9 11 1234-5678"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-sm outline-none transition-all placeholder-white/25 focus:bg-[#151515] ${
                formErrors.customerPhone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'
              }`}
            />
            {formErrors.customerPhone && (
              <span className="text-[10px] text-red-400 font-semibold mt-1 block">{formErrors.customerPhone}</span>
            )}
          </div>

          {/* Delivery Type Toggle */}
          <div>
            <label className="text-xs font-bold text-white/60 block mb-1.5">Método de Entrega:</label>
            <div className="grid grid-cols-2 gap-2 bg-[#0F0F0F] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setDeliveryType('envio')}
                className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  deliveryType === 'envio'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                    : 'text-white/45 hover:text-white'
                }`}
              >
                Envío a domicilio
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('takeaway')}
                className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  deliveryType === 'takeaway'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                    : 'text-white/45 hover:text-white'
                }`}
              >
                Retirar en local
              </button>
            </div>
          </div>

          {/* Delivery Address (Conditionally visible) */}
          <AnimatePresence>
            {deliveryType === 'envio' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="text-xs font-bold text-white/60 block mb-1.5 flex items-center gap-1.5 mt-2">
                  <MapPin size={13} className="text-orange-500" />
                  Dirección Completa de Envío:
                </label>
                <input
                  type="text"
                  required={deliveryType === 'envio'}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Calle, Número, Departamento, Ciudad"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-sm outline-none transition-all placeholder-white/25 focus:bg-[#151515] ${
                    formErrors.customerAddress ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'
                  }`}
                />
                {formErrors.customerAddress && (
                  <span className="text-[10px] text-red-400 font-semibold mt-1 block">{formErrors.customerAddress}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Local Pickup Address Announcement */}
          {deliveryType === 'takeaway' && (
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 text-xs text-white/60 leading-relaxed mt-2">
              📌 <strong>Retiro en sucursal:</strong> Podés retirar tu pedido en nuestra sede en: <br />
              <em className="text-white font-bold block mt-1">{settings.storeAddress}</em>
              Nos pondremos en contacto para avisarte cuando esté listo.
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-white/60 block mb-2">Forma de Pago:</label>
            <div className="space-y-2">
              {/* Mercado Pago option */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'mercado_pago'
                  ? 'bg-orange-600/10 border-orange-600/80'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mercado_pago'}
                    onChange={() => setPaymentMethod('mercado_pago')}
                    className="accent-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Mercado Pago</span>
                    <span className="text-[10px] text-white/40 block leading-tight">Simulador dinámico o link directo</span>
                  </div>
                </div>
                <span className="font-extrabold text-[9px] tracking-widest text-orange-400 bg-orange-600/20 px-2.5 py-1 rounded-md uppercase">
                  RECOMENDADO
                </span>
              </label>

              {/* Transfer option */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'transferencia'
                  ? 'bg-orange-600/10 border-orange-600/80'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'transferencia'}
                    onChange={() => setPaymentMethod('transferencia')}
                    className="accent-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Transferencia Bancaria</span>
                    <span className="text-[10px] text-white/40 block leading-tight">Pagá con CVU / Alias desde cualquier billetera</span>
                  </div>
                </div>
                <span className="font-bold text-[9px] tracking-widest text-orange-400 bg-orange-600/20 px-2.5 py-1 rounded-md uppercase">
                  CVU / ALIAS
                </span>
              </label>

              {/* Cash option */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'efectivo'
                  ? 'bg-orange-600/10 border-orange-600/80'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'efectivo'}
                    onChange={() => setPaymentMethod('efectivo')}
                    className="accent-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Efectivo / Contraentrega</span>
                    <span className="text-[10px] text-white/40 block leading-tight">Abona al retirar en local o recibir</span>
                  </div>
                </div>
                <span className="font-bold text-[9px] tracking-widest text-white/50 bg-white/10 px-2.5 py-1 rounded-md uppercase">
                  EFECTIVO
                </span>
              </label>
            </div>

            {/* Transfer Info Box with One-Click Copy */}
            {paymentMethod === 'transferencia' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-orange-600/5 border border-orange-600/20 rounded-2xl space-y-3 mt-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
                  <CreditCard size={14} />
                  <span>Datos de Transferencia Bancaria</span>
                </div>
                <p className="text-[10px] text-white/55 leading-relaxed">
                  Transferí el importe total a nuestra cuenta y envianos el comprobante por WhatsApp para confirmar tu compra.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[9px] text-white/30 block font-bold uppercase tracking-wider">Alias de Pago</span>
                      <span className="font-mono text-xs text-white font-bold">{settings.mercadoPagoAlias}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(settings.mercadoPagoAlias);
                        setCopiedField('alias');
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-white/5 cursor-pointer"
                    >
                      {copiedField === 'alias' ? '¡Copiado! 📋' : 'Copiar'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[9px] text-white/30 block font-bold uppercase tracking-wider">CVU</span>
                      <span className="font-mono text-xs text-white font-bold">{settings.mercadoPagoCvu}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(settings.mercadoPagoCvu);
                        setCopiedField('cvu');
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-white/5 cursor-pointer"
                    >
                      {copiedField === 'cvu' ? '¡Copiado! 📋' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Pricing summary */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2.5 mt-4">
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>Subtotal</span>
              <span className="font-mono text-white">
                {settings.currencySymbol}
                {subtotal.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>Costo de Envío</span>
              <span className="font-mono text-white">
                {deliveryCost === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">¡Gratis!</span>
                ) : (
                  `${settings.currencySymbol}${deliveryCost.toLocaleString('es-AR')}`
                )}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-2.5 text-sm font-black text-white mt-2">
              <span>Total a Pagar</span>
              <span className="font-mono text-base text-orange-500">
                {settings.currencySymbol}
                {total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Main Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/20 active:scale-98 transition-all mt-4"
          >
            {paymentMethod === 'mercado_pago' && settings.enableMercadoPagoSimulator ? (
              <>
                <CreditCard size={14} />
                Pagar con Mercado Pago & Confirmar
              </>
            ) : (
              <>
                <MessageCircle size={14} />
                Enviar Pedido por WhatsApp
              </>
            )}
            <ChevronRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
