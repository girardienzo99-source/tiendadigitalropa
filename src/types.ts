/**
 * Types definition for the Sneakers & Textile Digital Store
 */

export interface Review {
  id: string;
  rating: number; // 1 to 5
  userName: string;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number; // Optional promotional/discounted price
  category: 'zapatillas' | 'ropa' | 'accesorios';
  subcategory?: 'playeras' | 'pantalones' | 'jeans' | 'sudaderas' | 'camisolas' | 'zapatillas';
  image: string;
  stock: number;
  sizes: string[]; // e.g. ["39", "40", "41", "42"] or ["S", "M", "L", "XL"]
  colors?: string[]; // e.g. ["Rojo", "Negro", "Blanco"]
  featured?: boolean;
  tags?: string[]; // e.g. ["Nuevo", "Hot Sale", "Último disponible"]
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  linkToCategory?: 'zapatillas' | 'ropa' | 'accesorios' | 'all';
  discountText?: string; // e.g. "20% OFF"
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string; // Phone number in international format, e.g. "5491123456789"
  currencySymbol: string; // e.g. "$"
  mercadoPagoAlias: string; // e.g. "tienda.calzado.mp"
  mercadoPagoCvu: string; // e.g. "0000003100000000000000"
  deliveryCost: number;
  freeDeliveryThreshold?: number;
  storeAddress: string;
  enableMercadoPagoSimulator: boolean;
  notifOrderConfirm?: string;
  notifPendingPayment?: string;
  notifShipped?: string;
  activePromoTitle?: string;
  activePromoText?: string;
  activePromoDiscount?: number;
  activePromoCategory?: string;
  activePromoActive?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryType: 'envio' | 'takeaway';
  paymentMethod: 'mercado_pago' | 'transferencia' | 'efectivo';
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size: string;
    color?: string;
  }[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  status: 'pendiente' | 'aprobado' | 'cancelado';
  createdAt: string;
}
