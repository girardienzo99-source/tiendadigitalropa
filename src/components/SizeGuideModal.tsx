import React from 'react';
import { motion } from 'motion/react';
import { X, Ruler, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'zapatillas' | 'ropa' | 'accesorios';
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const showFootwear = category === 'zapatillas';

  // Footwear size data
  const shoeSizes = [
    { ar: '36', cm: '23.0', us: '4.5', uk: '4.0' },
    { ar: '37', cm: '23.5', us: '5.0', uk: '4.5' },
    { ar: '38', cm: '24.5', us: '6.0', uk: '5.5' },
    { ar: '39', cm: '25.0', us: '6.5', uk: '6.0' },
    { ar: '40', cm: '25.5', us: '7.0', uk: '6.5' },
    { ar: '41', cm: '26.5', us: '8.0', uk: '7.5' },
    { ar: '42', cm: '27.0', us: '9.0', uk: '8.5' },
    { ar: '43', cm: '28.0', us: '10.0', uk: '9.5' },
    { ar: '44', cm: '28.5', us: '11.0', uk: '10.5' },
    { ar: '45', cm: '29.5', us: '12.0', uk: '11.5' },
  ];

  // Clothing size data
  const clothingSizes = [
    { size: 'XS', chest: '46 cm', length: '66 cm', shoulder: '41 cm' },
    { size: 'S', chest: '48 cm', length: '68 cm', shoulder: '43 cm' },
    { size: 'M', chest: '51 cm', length: '71 cm', shoulder: '45 cm' },
    { size: 'L', chest: '54 cm', length: '74 cm', shoulder: '47 cm' },
    { size: 'XL', chest: '58 cm', length: '77 cm', shoulder: '49 cm' },
    { size: 'XXL', chest: '62 cm', length: '80 cm', shoulder: '51 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Background click handler */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl bg-[#0F0F12] rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5 text-white">
            <Ruler size={18} className="text-white" />
            <h3 className="font-sans font-black text-base uppercase tracking-wider italic text-metallic">
              Guía de Talles & Medidas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
            aria-label="Cerrar modal de guía"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {showFootwear ? (
            /* FOOTWEAR GUIDE */
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex gap-3 text-xs text-white/70 leading-relaxed">
                <Info size={18} className="shrink-0 text-white mt-0.5" />
                <p>
                  Los talles expresados en nuestra web corresponden a la numeración **Argentina (AR)**. Te recomendamos medir tu pie en centímetros para seleccionar el talle ideal.
                </p>
              </div>

              {/* Table */}
              <div className="overflow-hidden border border-white/5 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-white font-black uppercase tracking-wider">
                      <th className="p-3 border-b border-white/5">Talle AR (EU)</th>
                      <th className="p-3 border-b border-white/5">Medida (CM)</th>
                      <th className="p-3 border-b border-white/5">US Men</th>
                      <th className="p-3 border-b border-white/5">UK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoeSizes.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-white/[0.02] border-b border-white/5 transition-colors ${
                          idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                        }`}
                      >
                        <td className="p-3 font-bold text-white">{item.ar}</td>
                        <td className="p-3 font-mono text-white/80">{item.cm} cm</td>
                        <td className="p-3 font-mono text-white/60">{item.us}</td>
                        <td className="p-3 font-mono text-white/60">{item.uk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">¿Cómo medir tu pie?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs">1</div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Colocá una hoja de papel en el suelo contra la pared y apoya tu talón bien pegado a la pared.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs">2</div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Marcá con un lápiz el punto más largo de tu pie (generalmente el dedo gordo) en el papel.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs">3</div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Medí la distancia en centímetros desde el borde de la hoja hasta tu marca y comparala con la tabla.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CLOTHING GUIDE */
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex gap-3 text-xs text-white/70 leading-relaxed">
                <Info size={18} className="shrink-0 text-white mt-0.5" />
                <p>
                  Nuestras remeras y buzos tienen un corte moderno y ligeramente holgado. Te recomendamos medir una prenda tuya sobre una superficie plana para comparar.
                </p>
              </div>

              {/* Table */}
              <div className="overflow-hidden border border-white/5 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-white font-black uppercase tracking-wider">
                      <th className="p-3 border-b border-white/5">Talle</th>
                      <th className="p-3 border-b border-white/5">Ancho (Pecho)</th>
                      <th className="p-3 border-b border-white/5">Largo Total</th>
                      <th className="p-3 border-b border-white/5">Ancho Hombros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clothingSizes.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-white/[0.02] border-b border-white/5 transition-colors ${
                          idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                        }`}
                      >
                        <td className="p-3 font-bold text-white">{item.size}</td>
                        <td className="p-3 font-mono text-white/80">{item.chest}</td>
                        <td className="p-3 font-mono text-white/80">{item.length}</td>
                        <td className="p-3 font-mono text-white/60">{item.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">¿Cómo medir una prenda?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">A</div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">Ancho de Pecho (Sisa)</span>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Medí horizontalmente desde la costura de una axila hasta la otra, justo por debajo del pecho.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">B</div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">Largo Total</span>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Medí verticalmente desde la costura más alta del hombro (cerca del cuello) hasta el borde inferior.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </div>
  );
}
