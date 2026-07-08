import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_SETTINGS } from '../src/data';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting Supabase Seeding...');

  // 1. Seed Products
  console.log(`Seeding ${INITIAL_PRODUCTS.length} products...`);
  const productsToInsert = INITIAL_PRODUCTS.map((p) => ({
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

  const { error: prodError } = await supabase.from('products').upsert(productsToInsert);
  if (prodError) {
    console.error('Error seeding products:', prodError);
  } else {
    console.log('Products seeded successfully!');
  }

  // 2. Seed Banners
  console.log(`Seeding ${INITIAL_BANNERS.length} banners...`);
  const bannersToInsert = INITIAL_BANNERS.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    link_to_category: b.linkToCategory || 'all',
    discount_text: b.discountText || null,
    active: b.active
  }));

  const { error: bannerError } = await supabase.from('banners').upsert(bannersToInsert);
  if (bannerError) {
    console.error('Error seeding banners:', bannerError);
  } else {
    console.log('Banners seeded successfully!');
  }

  // 3. Seed Settings
  console.log('Seeding settings...');
  const settingsToInsert = {
    id: 1, // Singleton row
    store_name: INITIAL_SETTINGS.storeName,
    whatsapp_number: INITIAL_SETTINGS.whatsappNumber,
    currency_symbol: INITIAL_SETTINGS.currencySymbol,
    mercado_pago_alias: INITIAL_SETTINGS.mercadoPagoAlias,
    mercado_pago_cvu: INITIAL_SETTINGS.mercadoPagoCvu,
    delivery_cost: INITIAL_SETTINGS.deliveryCost,
    free_delivery_threshold: INITIAL_SETTINGS.freeDeliveryThreshold || null,
    store_address: INITIAL_SETTINGS.storeAddress,
    enable_mercado_pago_simulator: INITIAL_SETTINGS.enableMercadoPagoSimulator,
    notif_order_confirm: INITIAL_SETTINGS.notifOrderConfirm || null,
    notif_pending_payment: INITIAL_SETTINGS.notifPendingPayment || null,
    notif_shipped: INITIAL_SETTINGS.notifShipped || null,
    active_promo_title: INITIAL_SETTINGS.activePromoTitle || null,
    active_promo_text: INITIAL_SETTINGS.activePromoText || null,
    active_promo_discount: INITIAL_SETTINGS.activePromoDiscount || null,
    active_promo_category: INITIAL_SETTINGS.activePromoCategory || null,
    active_promo_active: INITIAL_SETTINGS.activePromoActive || false
  };

  const { error: settingsError } = await supabase.from('settings').upsert(settingsToInsert);
  if (settingsError) {
    console.error('Error seeding settings:', settingsError);
  } else {
    console.log('Settings seeded successfully!');
  }

  console.log('Seeding completed!');
}

seed().catch((err) => {
  console.error('Unexpected seeding error:', err);
  process.exit(1);
});
