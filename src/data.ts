import { Product, PromoBanner, StoreSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- Footwear (Zapatillas) ---
  {
    id: 'zap-1',
    name: 'Zapatillas Retro Aura Premium',
    description: 'Diseño urbano clásico con detalles de gamuza fina, entresuela amortiguada de espuma eva y suela de tracción premium. El calzado definitivo para el estilo diario.',
    price: 125000,
    promoPrice: 98000,
    category: 'zapatillas',
    subcategory: 'zapatillas',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Lila/Multicolor', 'Blanco Puro'],
    featured: true,
    tags: ['Más Vendido', '20% OFF'],
    reviews: [
      { id: 'rev-1', rating: 5, userName: 'Mateo Fernández', comment: 'Excelente calidad y súper cómodas. El diseño es increíble, llaman mucho la atención. ¡Envío súper rápido!', createdAt: '02/07/2026' },
      { id: 'rev-2', rating: 4, userName: 'Sofía Romero', comment: 'Muy lindas, el talle me fue perfecto. El color lila en vivo es hermoso.', createdAt: '04/07/2026' }
    ]
  },
  {
    id: 'zap-2',
    name: 'Runners Air Velocity Red',
    description: 'Rendimiento y amortiguación sin precedentes. Capellada tejida ultra transpirable que se adapta al pie y cámara de aire de última generación para una pisada suave.',
    price: 142000,
    category: 'zapatillas',
    subcategory: 'zapatillas',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    stock: 8,
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Rojo Carmín', 'Negro Obsidiana'],
    featured: true,
    tags: ['Destacado'],
    reviews: [
      { id: 'rev-3', rating: 5, userName: 'Bautista Gómez', comment: 'Ideales para correr y entrenar. Siento que amortiguan súper bien. Muy recomendadas.', createdAt: '28/06/2026' }
    ]
  },
  {
    id: 'zap-3',
    name: 'Court Classics Minimalist White',
    description: 'Estilo clásico inspirado en el tenis de los 80. Confeccionadas en cuero sintético de alta resistencia y suela vulcanizada plana para máxima durabilidad y agarre.',
    price: 95000,
    promoPrice: 85000,
    category: 'zapatillas',
    subcategory: 'zapatillas',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
    stock: 15,
    sizes: ['37', '38', '39', '40', '41', '42'],
    colors: ['Blanco/Verde', 'Blanco/Gris'],
    featured: false,
    tags: ['Clásico']
  },
  {
    id: 'zap-4',
    name: 'All-Terrain Urban Stealth Black',
    description: 'Zapatilla urbana reforzada con recubrimiento hidrófugo y suela con tacos de alta adherencia. Ideal para caminar la ciudad bajo cualquier clima.',
    price: 110000,
    category: 'zapatillas',
    subcategory: 'zapatillas',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    stock: 5,
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Negro Mate'],
    featured: false,
    tags: ['Últimos Pares']
  },

  // --- Playeras (T-Shirts) ---
  {
    id: 'tex-2',
    name: 'Remera Minimalist Heavyweight',
    description: 'Remera de cuello redondo confeccionada en jersey de algodón 100% premium de hilado peinado de 24/1. No encoge ni pierde color.',
    price: 32000,
    category: 'ropa',
    subcategory: 'playeras',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    stock: 35,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blanco Óptico', 'Negro', 'Verde Militar'],
    featured: true,
    tags: ['Básico']
  },
  {
    id: 'tex-5',
    name: 'Remera Graphic Vintage Drop',
    description: 'Remera oversize confeccionada en algodón rústico grueso con estampa vintage desgastada en la espalda. Lavado a la piedra para un estilo grunge.',
    price: 34000,
    promoPrice: 28000,
    category: 'ropa',
    subcategory: 'playeras',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    stock: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gris Ceniza', 'Crema Vintage'],
    featured: false,
    tags: ['Lanzamiento', 'Oversize']
  },

  // --- Pantalones (Trousers) ---
  {
    id: 'tex-3',
    name: 'Pantalón Cargo Flex Utility',
    description: 'Pantalón cargo de gabardina elastizada de alta resistencia. Cuenta con 6 bolsillos funcionales, botamanga con ajuste elástico y corte tapered de máxima comodidad.',
    price: 78000,
    promoPrice: 69000,
    category: 'ropa',
    subcategory: 'pantalones',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    stock: 14,
    sizes: ['38', '40', '42', '44'],
    colors: ['Beige', 'Negro', 'Azul Marino'],
    featured: false,
    tags: ['Cargo']
  },
  {
    id: 'tex-6',
    name: 'Pantalón Chino Urban Slim',
    description: 'Pantalón chino moderno de corte slim fit en gabardina de algodón peinado satinado. Súper versátil, ideal tanto para la oficina como para salidas casuales.',
    price: 65000,
    category: 'ropa',
    subcategory: 'pantalones',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    stock: 11,
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Marrón Tabaco', 'Azul Marino', 'Negro'],
    featured: false,
    tags: ['Esencial']
  },

  // --- Jeans ---
  {
    id: 'tex-7',
    name: 'Jean Denim Classic Straight',
    description: 'Jean de calce recto confeccionado en denim de algodón rígido de 12 oz de calidad exportación. Proceso de lavado vintage localizado y costuras reforzadas.',
    price: 79000,
    promoPrice: 62000,
    category: 'ropa',
    subcategory: 'jeans',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    stock: 18,
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Azul Pre-Wash', 'Azul Indigo'],
    featured: true,
    tags: ['Denim Real', 'Promo']
  },
  {
    id: 'tex-8',
    name: 'Jean Baggy Loose Fit Blackout',
    description: 'Jean holgado estilo Loose Fit de tiro medio en denim negro profundo. Súper cómodo, con un calce holgado desde la cadera hasta la bota para el look urbano definitivo.',
    price: 84000,
    category: 'ropa',
    subcategory: 'jeans',
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&auto=format&fit=crop&q=80',
    stock: 15,
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Negro Desgastado', 'Negro Puro'],
    featured: false,
    tags: ['Streetwear']
  },

  // --- Sudaderas (Hoodies & Sweaters) ---
  {
    id: 'tex-1',
    name: 'Buzo Urban Core Oversized',
    description: 'Buzo estilo hoodie confeccionado en algodón rústico pesado de máxima calidad. Calce oversized con hombros caídos y capucha forrada de doble tela.',
    price: 68000,
    promoPrice: 55000,
    category: 'ropa',
    subcategory: 'sudaderas',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gris Melange', 'Negro', 'Beige'],
    featured: true,
    tags: ['Esencial', 'Hot Deal']
  },
  {
    id: 'tex-9',
    name: 'Sudadera Half-Zip Sherpa',
    description: 'Sudadera de cuello alto con medio cierre confeccionada en material polar sherpa texturado de altísima retención térmica. Súper abrigada y suave.',
    price: 72000,
    category: 'ropa',
    subcategory: 'sudaderas',
    image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=600&auto=format&fit=crop&q=80',
    stock: 9,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige Arena', 'Verde Bosque'],
    featured: false,
    tags: ['Invierno']
  },

  // --- Camisolas / Camisas (Shirts) ---
  {
    id: 'tex-10',
    name: 'Camisola Lino Relaxed Fit',
    description: 'Camisola tejida en hilo de puro lino italiano de calce relajado. Textura ultra transpirable perfecta para días cálidos u oficinas. Cuello mao elegante.',
    price: 58000,
    promoPrice: 49000,
    category: 'ropa',
    subcategory: 'camisolas',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    stock: 13,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco Crudo', 'Celeste Pastel'],
    featured: false,
    tags: ['Lino', 'Elegante']
  },
  {
    id: 'tex-11',
    name: 'Camisa Leñadora Heavy Flannel',
    description: 'Camisa de franela pesada a cuadros clásicos con botones acrílicos y doble bolsillo en el pecho. Calidez y estilo atemporal confeccionado en hilado premium.',
    price: 62000,
    category: 'ropa',
    subcategory: 'camisolas',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
    stock: 16,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Rojo/Negro', 'Verde/Azul'],
    featured: true,
    tags: ['Atemporal']
  }
];

export const INITIAL_BANNERS: PromoBanner[] = [
  {
    id: 'ban-1',
    title: 'TEMPORADA URBANA DROP',
    subtitle: 'Zapatillas y ropa con estilo urbano insuperable. Renová tu look.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
    linkToCategory: 'all',
    discountText: 'HASTA 25% OFF',
    active: true
  },
  {
    id: 'ban-2',
    title: 'ZAPATILLAS DESTACADAS',
    subtitle: 'Calzado premium de diseño exclusivo y confort inigualable en cada pisada.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80',
    linkToCategory: 'zapatillas',
    discountText: 'ENVÍO GRATIS',
    active: true
  },
  {
    id: 'ban-3',
    title: 'NUEVA COLECCIÓN TEXTIL',
    subtitle: 'Remeras, buzos y pantalones con los mejores cortes y algodón premium.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80',
    linkToCategory: 'ropa',
    discountText: 'LANZAMIENTO',
    active: true
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Zapas & Co. Urban Store',
  whatsappNumber: '5491133445566', // Number in international format for testing
  currencySymbol: '$',
  mercadoPagoAlias: 'tienda.urbana.mp',
  mercadoPagoCvu: '0000003100000000000042',
  deliveryCost: 3500,
  freeDeliveryThreshold: 85000, // Free delivery for orders above $85,000
  storeAddress: 'Av. Santa Fe 1540, Palermo, CABA, Argentina',
  enableMercadoPagoSimulator: true,
  notifOrderConfirm: '¡Hola {CLIENTE}! Recibimos tu pedido #{PEDIDO_ID} de {PRODUCTOS} por un total de {TOTAL}. ¡Gracias por confiar en nosotros! 🛍️',
  notifPendingPayment: '¡Hola {CLIENTE}! Para confirmar tu pedido #{PEDIDO_ID} de {TOTAL}, completá el pago a nuestro Alias: {ALIAS_MP} y envianos el comprobante por acá. ¡Muchas gracias! 🏦',
  notifShipped: '¡Hola {CLIENTE}! Tu pedido #{PEDIDO_ID} de {PRODUCTOS} ya fue despachado y va en viaje a tu domicilio. ¡Disfrutalo! 🚚',
  activePromoTitle: '🔥 Promo Relámpago de la Semana',
  activePromoText: 'Comprando cualquier prenda o zapatilla de nuestra colección, llevate un 15% de descuento directo y envío gratis en pedidos seleccionados. ¡Respondé o comprá hoy!',
  activePromoDiscount: 15,
  activePromoCategory: 'all',
  activePromoActive: true
};
