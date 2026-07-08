import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, QrCode, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Copy, Check, ArrowRight } from 'lucide-react';
import { StoreSettings } from '../types';

interface MercadoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryType: 'envio' | 'takeaway';
    paymentMethod: 'mercado_pago' | 'transferencia' | 'efectivo';
    total: number;
    subtotal: number;
    deliveryCost: number;
    onSuccess: (paymentId: string) => void;
  } | null;
  settings: StoreSettings;
}

export default function MercadoPagoModal({ isOpen, onClose, orderDetails, settings }: MercadoPagoModalProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'qr'>('card');
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'approved' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPaymentState('idle');
      setErrorMessage('');
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCvv('');
      setPaymentId(`MP-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  }, [isOpen]);

  if (!isOpen || !orderDetails) return null;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(settings.mercadoPagoAlias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardCvv(value);
    }
  };

  const handleSubmitCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 15) {
      setErrorMessage('Ingresá un número de tarjeta válido');
      return;
    }
    if (!cardName.trim()) {
      setErrorMessage('Ingresá el nombre impreso en la tarjeta');
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage('Ingresá la fecha de vencimiento (MM/AA)');
      return;
    }
    if (cardCvv.length < 3) {
      setErrorMessage('Ingresá el código de seguridad de 3 o 4 dígitos');
      return;
    }

    setErrorMessage('');
    processPayment();
  };

  const processPayment = () => {
    setPaymentState('processing');
    
    // Simulate transaction processing latency
    setTimeout(() => {
      // Simulate successful payment
      setPaymentState('approved');
    }, 2500);
  };

  const handleSuccessRedirect = () => {
    orderDetails.onSuccess(paymentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#0F0F0F] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Mercado Pago Custom Header */}
        <div className="bg-[#009EE3] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight font-sans italic flex items-center">
              mercado <span className="font-medium not-italic text-sky-100">pago</span>
            </span>
            <span className="text-[10px] bg-sky-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              SANDBOX SIMULADOR
            </span>
          </div>
          {paymentState === 'idle' && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-sky-600 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Store Context & Amount Row */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-[#009EE3] font-black uppercase tracking-widest block">Estás comprando en:</span>
            <span className="text-sm font-bold text-white block truncate max-w-[200px]">
              {settings.storeName.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-[#009EE3] font-black uppercase tracking-widest block">Monto total:</span>
            <span className="text-lg font-black text-orange-500 font-mono">
              {settings.currencySymbol}
              {orderDetails.total.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* 1. IDLE STATE: Choose and Fill Payment */}
            {paymentState === 'idle' && (
              <motion.div
                key="idle-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Tabs selection */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black rounded-xl border border-white/5">
                  <button
                    onClick={() => { setActiveTab('card'); setErrorMessage(''); }}
                    className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'card'
                        ? 'bg-[#009EE3] text-white shadow-md'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <CreditCard size={14} />
                    Tarjeta
                  </button>
                  <button
                    onClick={() => { setActiveTab('qr'); setErrorMessage(''); }}
                    className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'qr'
                        ? 'bg-[#009EE3] text-white shadow-md'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <QrCode size={14} />
                    Código QR
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-600/10 border border-red-500/20 text-xs text-red-400 font-medium flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    {errorMessage}
                  </div>
                )}

                {/* TAB 1: Card checkout */}
                {activeTab === 'card' && (
                  <form onSubmit={handleSubmitCardPayment} className="space-y-4 font-sans">
                    {/* Card input */}
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-white/30 block uppercase mb-1.5">Número de Tarjeta:</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4517 1234 5678 9012"
                          className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono outline-none focus:border-[#009EE3] focus:bg-black transition-all"
                        />
                        <CreditCard size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      </div>
                    </div>

                    {/* Cardholder name */}
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-white/30 block uppercase mb-1.5">Nombre en la Tarjeta:</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="COMO FIGURA IMPRESO"
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#009EE3] focus:bg-black transition-all font-mono placeholder:font-sans"
                      />
                    </div>

                    {/* Expiry and CVV Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black tracking-widest text-white/30 block uppercase mb-1.5">Vencimiento:</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono outline-none focus:border-[#009EE3] focus:bg-black transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black tracking-widest text-white/30 block uppercase mb-1.5">Cód. Seguridad:</label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={handleCvvChange}
                          placeholder="CVV"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono outline-none focus:border-[#009EE3] focus:bg-black transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Payment Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#009EE3] hover:bg-[#0086C3] text-white font-extrabold text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <ShieldCheck size={16} />
                      Simular Pago de {settings.currencySymbol}{orderDetails.total.toLocaleString('es-AR')}
                    </button>
                  </form>
                )}

                {/* TAB 2: QR Code / Transfer */}
                {activeTab === 'qr' && (
                  <div className="space-y-4 text-center">
                    <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                      Escaneá este código QR simulado desde tu celular o copiá los datos para realizar la transferencia de prueba.
                    </p>

                    {/* QR Code Container */}
                    <div className="w-40 h-40 bg-black border border-white/10 rounded-2xl mx-auto flex items-center justify-center p-2">
                      <div className="p-2 bg-white rounded-lg border border-sky-100">
                        {/* Realistic Mock QR Design */}
                        <svg className="w-32 h-32 text-neutral-800" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="white"/>
                          {/* Corner squares */}
                          <rect x="5" y="5" width="25" height="25" fill="currentColor"/>
                          <rect x="10" y="10" width="15" height="15" fill="white"/>
                          <rect x="13" y="13" width="9" height="9" fill="currentColor"/>
                          
                          <rect x="70" y="5" width="25" height="25" fill="currentColor"/>
                          <rect x="75" y="10" width="15" height="15" fill="white"/>
                          <rect x="78" y="13" width="9" height="9" fill="currentColor"/>
                          
                          <rect x="5" y="70" width="25" height="25" fill="currentColor"/>
                          <rect x="10" y="75" width="15" height="15" fill="white"/>
                          <rect x="13" y="78" width="9" height="9" fill="currentColor"/>
                          
                          {/* Center design (Mercado Pago Logo inspired) */}
                          <circle cx="50" cy="50" r="10" fill="#009EE3"/>
                          <path d="M47 50 L49 52 L53 48" stroke="white" strokeWidth="2.5" fill="none"/>

                          {/* Random QR pixels */}
                          <rect x="35" y="10" width="5" height="10" fill="currentColor"/>
                          <rect x="45" y="5" width="10" height="5" fill="currentColor"/>
                          <rect x="60" y="15" width="5" height="15" fill="currentColor"/>
                          <rect x="35" y="25" width="10" height="5" fill="currentColor"/>
                          
                          <rect x="10" y="35" width="15" height="5" fill="currentColor"/>
                          <rect x="15" y="45" width="5" height="10" fill="currentColor"/>
                          <rect x="5" y="60" width="10" height="5" fill="currentColor"/>
                          
                          <rect x="75" y="35" width="5" height="15" fill="currentColor"/>
                          <rect x="85" y="45" width="10" height="5" fill="currentColor"/>
                          <rect x="70" y="60" width="15" height="5" fill="currentColor"/>
                          
                          <rect x="35" y="70" width="10" height="5" fill="currentColor"/>
                          <rect x="40" y="80" width="5" height="15" fill="currentColor"/>
                          <rect x="50" y="75" width="15" height="5" fill="currentColor"/>
                          <rect x="60" y="85" width="10" height="5" fill="currentColor"/>
                          
                          <rect x="45" y="60" width="5" height="10" fill="currentColor"/>
                          <rect x="55" y="65" width="10" height="5" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>

                    {/* Copy Info Box */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-2.5 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[9px] text-white/30 font-black uppercase tracking-wider block">Alias Mercado Pago</span>
                          <span className="font-bold text-white">{settings.mercadoPagoAlias}</span>
                        </div>
                        <button
                          onClick={handleCopyAlias}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-white/80 active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                        >
                          {copiedAlias ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>

                      <div className="border-t border-white/5 pt-2">
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-wider block mb-0.5">C.V.U.</span>
                        <span className="font-mono text-xs text-white tracking-widest block truncate">
                          {settings.mercadoPagoCvu}
                        </span>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={processPayment}
                      className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Ya transferí, verificar pago
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. PROCESSING STATE: Loading Spinner */}
            {paymentState === 'processing' && (
              <motion.div
                key="processing-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center text-center space-y-4"
              >
                <Loader2 size={44} className="text-[#009EE3] animate-spin" />
                <h4 className="font-sans font-bold text-base text-white">Procesando pago...</h4>
                <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                  Buscando autorización con la entidad emisora del simulador. Por favor, no recargues ni cierres la página.
                </p>
              </motion.div>
            )}

            {/* 3. APPROVED STATE: Confetti receipt */}
            {paymentState === 'approved' && (
              <motion.div
                key="approved-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border-2 border-emerald-500/50 animate-bounce">
                  <CheckCircle2 size={36} className="fill-emerald-500/10" />
                </div>
                
                <div>
                  <h4 className="font-sans font-black text-xl text-emerald-400 uppercase tracking-tight italic">¡Pago Aprobado!</h4>
                  <p className="text-xs text-white/50">Transacción completada exitosamente en el sandbox.</p>
                </div>

                {/* Receipt ticket detail */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2 max-w-sm mx-auto shadow-inner text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40 font-medium">Referencia MP:</span>
                    <span className="font-mono font-bold text-white">{paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 font-medium">Comprador:</span>
                    <span className="font-bold text-white">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 font-medium">Fecha:</span>
                    <span className="font-bold text-white">{new Date().toLocaleDateString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 font-medium">Forma de pago:</span>
                    <span className="font-bold text-white">Simulador de Crédito</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 font-black text-sm">
                    <span className="text-white">Total debitado:</span>
                    <span className="font-mono text-orange-500">
                      {settings.currencySymbol}
                      {orderDetails.total.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-orange-400 bg-orange-600/10 p-3 rounded-lg border border-orange-500/20 max-w-sm mx-auto leading-relaxed">
                  ⚠️ <strong>Último paso requerido:</strong> Hacé clic en el botón de abajo para enviar la orden pre-paga con el código de referencia <strong>{paymentId}</strong> por WhatsApp al dueño del negocio para coordinar el despacho.
                </p>

                {/* Action Button */}
                <button
                  onClick={handleSuccessRedirect}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  Continuar a WhatsApp
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Footing */}
        <div className="bg-[#0A0A0A] px-6 py-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-white/30 font-semibold font-sans">
          <ShieldCheck size={12} className="text-white/40" />
          Conexión segura cifrada SSL en entorno sandbox
        </div>
      </motion.div>
    </div>
  );
}
