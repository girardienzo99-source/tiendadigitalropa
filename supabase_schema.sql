-- SQL Schema for Sneakers & Textile Digital Store
-- Copy and paste this script in your Supabase project SQL Editor (https://supabase.com) and click Run.

-- 1. Create PRODUCTS table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    promo_price NUMERIC,
    category TEXT NOT NULL,
    subcategory TEXT,
    image TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]'::jsonb,
    reviews JSONB DEFAULT '[]'::jsonb
);

-- 2. Create BANNERS table
CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image TEXT NOT NULL,
    link_to_category TEXT NOT NULL DEFAULT 'all',
    discount_text TEXT,
    active BOOLEAN NOT NULL DEFAULT true
);

-- 3. Create SETTINGS table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    store_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    currency_symbol TEXT NOT NULL DEFAULT '$',
    mercado_pago_alias TEXT NOT NULL,
    mercado_pago_cvu TEXT NOT NULL,
    delivery_cost NUMERIC NOT NULL DEFAULT 0,
    free_delivery_threshold NUMERIC,
    store_address TEXT NOT NULL,
    enable_mercado_pago_simulator BOOLEAN NOT NULL DEFAULT true,
    notif_order_confirm TEXT,
    notif_pending_payment TEXT,
    notif_shipped TEXT,
    active_promo_title TEXT,
    active_promo_text TEXT,
    active_promo_discount NUMERIC,
    active_promo_category TEXT,
    active_promo_active BOOLEAN NOT NULL DEFAULT false
);

-- 4. Create ORDERS table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    delivery_type TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_cost NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. Create public policies to allow open access (read/write/update/delete) for all tables
-- This ensures the client-side app can operate correctly without requiring user auth.
DROP POLICY IF EXISTS "Allow public all" ON products;
CREATE POLICY "Allow public all" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all" ON banners;
CREATE POLICY "Allow public all" ON banners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all" ON settings;
CREATE POLICY "Allow public all" ON settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all" ON orders;
CREATE POLICY "Allow public all" ON orders FOR ALL USING (true) WITH CHECK (true);
