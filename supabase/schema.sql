-- ============================================
-- MALIPULA SUITS - SUPABASE DATABASE SCHEMA
-- Royal. Rooted. Refined.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'TAILOR', 'STYLIST');
CREATE TYPE product_type AS ENUM ('SUIT', 'SHIRT', 'TROUSERS', 'BLAZER', 'WAISTCOAT', 'KAFTAN', 'ACCESSORY');
CREATE TYPE fabric_quality AS ENUM ('BUDGET', 'STANDARD', 'PREMIUM', 'LUXURY');
CREATE TYPE fit_type AS ENUM ('SLIM', 'REGULAR', 'RELAXED');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'DEPOSIT_PAID', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('CARD', 'MPESA', 'TIGO_PESA', 'AIRTEL_MONEY', 'BANK_TRANSFER', 'CASH');
CREATE TYPE delivery_method AS ENUM ('PICKUP', 'DELIVERY');
CREATE TYPE delivery_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED');
CREATE TYPE production_status AS ENUM ('PENDING', 'CUTTING', 'SEWING', 'FINISHING', 'QUALITY_CHECK', 'READY');
CREATE TYPE appointment_type AS ENUM ('IN_STORE_FITTING', 'VIRTUAL_CONSULTATION', 'MEASUREMENT_SESSION', 'STYLE_CONSULTATION', 'PICKUP');
CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================

CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    phone TEXT,
    name TEXT,
    image TEXT,
    role user_role DEFAULT 'CUSTOMER',
    email_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by all" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- FABRICS
-- ============================================

CREATE TABLE public.fabrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    material TEXT,
    composition TEXT,
    weight TEXT,
    texture TEXT,
    pattern TEXT,
    color TEXT,
    color_hex TEXT,
    image TEXT,
    images TEXT,
    price_per_meter DECIMAL(10,2) NOT NULL,
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    min_order DECIMAL(10,2) DEFAULT 1,
    origin TEXT,
    quality fabric_quality DEFAULT 'STANDARD',
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fabrics are viewable by all" ON public.fabrics
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage fabrics" ON public.fabrics
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    product_type product_type NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    images TEXT,
    thumbnail TEXT,
    tags TEXT,
    seo_title TEXT,
    seo_desc TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by all" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- PRODUCT ITEMS (Variants)
-- ============================================

CREATE TABLE public.product_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    fabric_id UUID REFERENCES public.fabrics(id) ON DELETE SET NULL,
    sku TEXT UNIQUE NOT NULL,
    color TEXT,
    size TEXT,
    price_modifier DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product items are viewable by all" ON public.product_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage product items" ON public.product_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- ADDRESSES
-- ============================================

CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    label TEXT,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT,
    country TEXT DEFAULT 'Tanzania',
    postal_code TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- MEASUREMENTS
-- ============================================

CREATE TABLE public.measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    profile_name TEXT DEFAULT 'Default',
    is_default BOOLEAN DEFAULT false,
    
    -- Upper Body (in cm)
    neck DECIMAL(6,2),
    shoulders DECIMAL(6,2),
    chest DECIMAL(6,2),
    waist DECIMAL(6,2),
    sleeve_length DECIMAL(6,2),
    wrist DECIMAL(6,2),
    back_length DECIMAL(6,2),
    
    -- Lower Body (in cm)
    hip DECIMAL(6,2),
    thigh DECIMAL(6,2),
    knee DECIMAL(6,2),
    calf DECIMAL(6,2),
    ankle DECIMAL(6,2),
    inseam DECIMAL(6,2),
    outseam DECIMAL(6,2),
    
    -- Full Body
    height DECIMAL(6,2),
    weight DECIMAL(6,2),
    
    -- Fit Preference
    fit_preference fit_type DEFAULT 'REGULAR',
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own measurements" ON public.measurements
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- CART ITEMS
-- ============================================

CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_item_id UUID REFERENCES public.product_items(id) ON DELETE SET NULL,
    fabric_id UUID REFERENCES public.fabrics(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    customization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, product_id, product_item_id, fabric_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- WISHLIST
-- ============================================

CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Pricing
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    shipping_cost DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    
    -- Payment
    payment_status payment_status DEFAULT 'PENDING',
    payment_method payment_method,
    payment_reference TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Delivery
    delivery_method delivery_method NOT NULL,
    delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    delivery_notes TEXT,
    delivery_status delivery_status DEFAULT 'PENDING',
    delivered_at TIMESTAMPTZ,
    
    -- Production
    production_status production_status DEFAULT 'PENDING',
    assigned_tailor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    estimated_ready TIMESTAMPTZ,
    actual_ready TIMESTAMPTZ,
    
    -- Status
    status order_status DEFAULT 'PENDING',
    notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancel_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- ORDER ITEMS
-- ============================================

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_item_id UUID REFERENCES public.product_items(id) ON DELETE SET NULL,
    
    -- Snapshot at time of order
    product_name TEXT NOT NULL,
    product_type product_type NOT NULL,
    fabric_name TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    
    -- Customization
    customization TEXT,
    measurement_id UUID REFERENCES public.measurements(id) ON DELETE SET NULL,
    special_requests TEXT,
    
    -- Production tracking
    production_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
    );

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    type appointment_type NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration INTEGER DEFAULT 60,
    status appointment_status DEFAULT 'PENDING',
    
    -- Location
    location TEXT,
    address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    is_virtual BOOLEAN DEFAULT false,
    meeting_link TEXT,
    
    -- Details
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Admins can manage all appointments" ON public.appointments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'TAILOR', 'STYLIST'))
    );

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    images TEXT,
    
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by all" ON public.reviews
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage own reviews" ON public.reviews
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Transaction Details
    tx_ref TEXT UNIQUE NOT NULL,
    flutterwave_id BIGINT,
    flutterwave_ref TEXT,
    
    -- Amount
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'TZS',
    
    -- Payment Method
    payment_method TEXT NOT NULL,
    phone_number TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending',
    
    -- Timestamps
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_tx_ref ON public.payments(tx_ref);
CREATE INDEX idx_payments_status ON public.payments(status);

CREATE TRIGGER handle_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- PROMOTIONS
-- ============================================

CREATE TABLE public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2),
    max_discount DECIMAL(10,2),
    
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active promotions are viewable by all" ON public.promotions
    FOR SELECT USING (is_active = true AND end_date > NOW());

CREATE POLICY "Admins can manage promotions" ON public.promotions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_type ON public.products(product_type);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_new ON public.products(is_new) WHERE is_new = true;

CREATE INDEX idx_fabrics_quality ON public.fabrics(quality);
CREATE INDEX idx_fabrics_premium ON public.fabrics(is_premium) WHERE is_premium = true;

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

CREATE INDEX idx_appointments_user ON public.appointments(user_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_at);

CREATE INDEX idx_cart_user ON public.cart_items(user_id);

CREATE INDEX idx_wishlist_user ON public.wishlists(user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_fabrics_updated_at
    BEFORE UPDATE ON public.fabrics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_product_items_updated_at
    BEFORE UPDATE ON public.product_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_measurements_updated_at
    BEFORE UPDATE ON public.measurements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_order_items_updated_at
    BEFORE UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_promotions_updated_at
    BEFORE UPDATE ON public.promotions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Handle new user creation from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, image)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true),
       ('fabrics', 'fabrics', true),
       ('users', 'users', false),
       ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Product images are public" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Fabric images are public" ON storage.objects
    FOR SELECT USING (bucket_id = 'fabrics');

CREATE POLICY "Review images are public" ON storage.objects
    FOR SELECT USING (bucket_id = 'reviews');

CREATE POLICY "Users can upload own images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'users' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own images" ON storage.objects
    FOR SELECT USING (bucket_id = 'users' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage product images" ON storage.objects
    FOR ALL USING (
        bucket_id = 'products' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================
-- DONE! Database schema is ready.
-- ============================================
