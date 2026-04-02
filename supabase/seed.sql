-- ============================================
-- MALIPULA SUITS - SEED DATA
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO public.categories (id, name, slug, description, image, "order", is_active) VALUES
(uuid_generate_v4(), 'Suits', 'suits', 'Premium bespoke suits for every occasion - from business meetings to special events', '/images/malipula/service1.jpg', 1, true),
(uuid_generate_v4(), 'Shirts', 'shirts', 'Custom-fitted shirts with premium fabrics and impeccable craftsmanship', '/images/malipula/service2.jpg', 2, true),
(uuid_generate_v4(), 'Traditional Wear', 'traditional-wear', 'African heritage meets modern elegance in our traditional collection', '/images/malipula/service3.jpg', 3, true),
(uuid_generate_v4(), 'Kaftans', 'kaftans', 'Royal kaftans for special occasions and cultural celebrations', '/images/malipula/service4.jpg', 4, true),
(uuid_generate_v4(), 'Trousers', 'trousers', 'Perfectly tailored trousers to complete your look', '/images/malipula/service1.jpg', 5, true),
(uuid_generate_v4(), 'Blazers', 'blazers', 'Stand-alone blazers for versatile styling options', '/images/malipula/service2.jpg', 6, true),
(uuid_generate_v4(), 'Waistcoats', 'waistcoats', 'Add sophistication with our tailored waistcoats', '/images/malipula/service3.jpg', 7, true),
(uuid_generate_v4(), 'Accessories', 'accessories', 'Ties, pocket squares, cufflinks and more', '/images/malipula/service4.jpg', 8, true);

-- ============================================
-- FABRICS
-- ============================================

INSERT INTO public.fabrics (id, name, slug, description, material, composition, weight, pattern, color, color_hex, price_per_meter, quality, origin, is_premium, is_active) VALUES
-- Premium Wools
(uuid_generate_v4(), 'Italian Super 150s Wool', 'italian-super-150s-wool', 'Luxurious Italian wool with exceptional drape and breathability', 'Wool', '100% Virgin Wool', '280 GSM', 'Solid', 'Navy Blue', '#1a2744', 150000, 'LUXURY', 'Italy', true, true),
(uuid_generate_v4(), 'British Super 130s Wool', 'british-super-130s-wool', 'Classic British wool known for durability and elegance', 'Wool', '100% Wool', '300 GSM', 'Solid', 'Charcoal Grey', '#36454f', 120000, 'PREMIUM', 'United Kingdom', true, true),
(uuid_generate_v4(), 'Merino Wool Blend', 'merino-wool-blend', 'Soft and breathable merino blend for comfort', 'Wool Blend', '70% Merino Wool, 30% Polyester', '260 GSM', 'Solid', 'Black', '#000000', 80000, 'PREMIUM', 'Australia', false, true),
(uuid_generate_v4(), 'Tropical Wool', 'tropical-wool', 'Lightweight wool perfect for Dar es Salaam climate', 'Wool', '100% Tropical Wool', '200 GSM', 'Solid', 'Light Grey', '#d3d3d3', 90000, 'STANDARD', 'Italy', false, true),

-- Patterns
(uuid_generate_v4(), 'Pinstripe Wool', 'pinstripe-wool', 'Classic pinstripe pattern for business suits', 'Wool', '100% Wool', '280 GSM', 'Pinstripe', 'Navy Pinstripe', '#1a2744', 130000, 'PREMIUM', 'Italy', true, true),
(uuid_generate_v4(), 'Glen Check Wool', 'glen-check-wool', 'Sophisticated glen plaid pattern', 'Wool', '100% Wool', '290 GSM', 'Check', 'Grey Check', '#4a5568', 125000, 'PREMIUM', 'United Kingdom', true, true),
(uuid_generate_v4(), 'Herringbone Wool', 'herringbone-wool', 'Classic herringbone weave for timeless style', 'Wool', '100% Wool', '285 GSM', 'Herringbone', 'Brown', '#8b4513', 110000, 'PREMIUM', 'Italy', false, true),

-- Cottons for Shirts
(uuid_generate_v4(), 'Egyptian Cotton', 'egyptian-cotton', 'Premium Egyptian cotton for luxurious shirts', 'Cotton', '100% Egyptian Cotton', '140 GSM', 'Solid', 'White', '#ffffff', 60000, 'LUXURY', 'Egypt', true, true),
(uuid_generate_v4(), 'Oxford Cotton', 'oxford-cotton', 'Classic oxford weave for casual elegance', 'Cotton', '100% Cotton', '160 GSM', 'Solid', 'Light Blue', '#add8e6', 40000, 'STANDARD', 'India', false, true),
(uuid_generate_v4(), 'Lincoln Cotton', 'lincoln-cotton', 'Soft and breathable cotton for everyday comfort', 'Cotton', '100% Cotton', '150 GSM', 'Solid', 'Pink', '#ffc0cb', 35000, 'STANDARD', 'India', false, true),

-- Linens
(uuid_generate_v4(), 'Pure Belgian Linen', 'pure-belgian-linen', 'Premium Belgian linen for hot weather', 'Linen', '100% Linen', '180 GSM', 'Solid', 'Natural', '#f5f5dc', 70000, 'PREMIUM', 'Belgium', true, true),
(uuid_generate_v4(), 'Linen Cotton Blend', 'linen-cotton-blend', 'Best of both worlds - linen breathability with cotton softness', 'Blend', '55% Linen, 45% Cotton', '170 GSM', 'Solid', 'Beige', '#f5f5dc', 50000, 'STANDARD', 'Belgium', false, true),

-- African Fabrics
(uuid_generate_v4(), 'Ankara Wax Print', 'ankara-wax-print', 'Vibrant African wax print fabric', 'Cotton', '100% Cotton', '180 GSM', 'Print', 'Multi-colored', '#ff6b35', 35000, 'STANDARD', 'Nigeria', false, true),
(uuid_generate_v4(), 'Kente Cloth', 'kente-cloth', 'Traditional Ghanaian kente cloth for special occasions', 'Cotton/Silk', 'Cotton and Silk Blend', '200 GSM', 'Woven Pattern', 'Gold/Red/Green', '#ffd700', 150000, 'LUXURY', 'Ghana', true, true),
(uuid_generate_v4(), 'Kitenge', 'kitenge', 'East African kitenge fabric with vibrant patterns', 'Cotton', '100% Cotton', '175 GSM', 'Print', 'Various', '#ff4500', 30000, 'BUDGET', 'Tanzania', false, true),
(uuid_generate_v4(), 'Dashiki Fabric', 'dashiki-fabric', 'Traditional dashiki fabric with embroidery', 'Cotton', '100% Cotton', '190 GSM', 'Embroidered', 'Various', '#800020', 45000, 'STANDARD', 'Nigeria', false, true),

-- Silk & Special Occasion
(uuid_generate_v4(), 'Mulberry Silk', 'mulberry-silk', 'Premium mulberry silk for special occasions', 'Silk', '100% Silk', '120 GSM', 'Solid', 'Ivory', '#fffff0', 200000, 'LUXURY', 'China', true, true),
(uuid_generate_v4(), 'Satin Silk', 'satin-silk', 'Lustrous satin silk for kaftans and special wear', 'Silk', '100% Silk Satin', '130 GSM', 'Solid', 'Gold', '#ffd700', 180000, 'LUXURY', 'China', true, true);

-- ============================================
-- PRODUCTS
-- ============================================

INSERT INTO public.products (id, name, slug, description, category_id, product_type, base_price, is_featured, is_new, images, thumbnail, tags) VALUES
-- SUITS
(uuid_generate_v4(), 'Royal Navy Three-Piece Suit', 'royal-navy-three-piece-suit', 'Our signature three-piece suit crafted from premium Italian wool. Features hand-stitched lapels, functional surgeon cuffs, and a perfectly tailored fit.', (SELECT id FROM public.categories WHERE slug = 'suits'), 'SUIT', 850000, true, true, '["/images/malipula/service1.jpg"]', '/images/malipula/service1.jpg', '["wedding", "business", "formal", "premium"]'),
(uuid_generate_v4(), 'Classic Charcoal Two-Piece Suit', 'classic-charcoal-two-piece-suit', 'Timeless elegance meets modern tailoring. Perfect for business and formal occasions.', (SELECT id FROM public.categories WHERE slug = 'suits'), 'SUIT', 650000, true, false, '["/images/malipula/service2.jpg"]', '/images/malipula/service2.jpg', '["business", "formal", "classic"]'),
(uuid_generate_v4(), 'Tropical Lightweight Suit', 'tropical-lightweight-suit', 'Designed for the East African climate. Breathable wool blend keeps you cool and stylish.', (SELECT id FROM public.categories WHERE slug = 'suits'), 'SUIT', 550000, false, true, '["/images/malipula/service3.jpg"]', '/images/malipula/service3.jpg', '["summer", "tropical", "lightweight"]'),
(uuid_generate_v4(), 'Executive Pinstripe Suit', 'executive-pinstripe-suit', 'Make a powerful statement with this classic pinstripe suit. Perfect for executives and special occasions.', (SELECT id FROM public.categories WHERE slug = 'suits'), 'SUIT', 750000, true, false, '["/images/malipula/service4.jpg"]', '/images/malipula/service4.jpg', '["executive", "business", "pinstripe"]'),

-- SHIRTS
(uuid_generate_v4(), 'Premium Egyptian Cotton Shirt', 'premium-egyptian-cotton-shirt', 'Luxurious Egyptian cotton shirt with mother-of-pearl buttons. Exceptional comfort and style.', (SELECT id FROM public.categories WHERE slug = 'shirts'), 'SHIRT', 150000, true, true, '["/images/malipula/team1.jpg"]', '/images/malipula/team1.jpg', '["premium", "cotton", "formal"]'),
(uuid_generate_v4(), 'Classic Oxford Shirt', 'classic-oxford-shirt', 'Versatile oxford shirt suitable for both casual and semi-formal occasions.', (SELECT id FROM public.categories WHERE slug = 'shirts'), 'SHIRT', 80000, false, false, '["/images/malipula/team2.jpg"]', '/images/malipula/team2.jpg', '["casual", "oxford", "everyday"]'),
(uuid_generate_v4(), 'Linen Summer Shirt', 'linen-summer-shirt', 'Breathable linen shirt perfect for Dar es Salaam weather. Relaxed elegance.', (SELECT id FROM public.categories WHERE slug = 'shirts'), 'SHIRT', 120000, false, true, '["/images/malipula/team3.jpg"]', '/images/malipula/team3.jpg', '["summer", "linen", "casual"]'),

-- TRADITIONAL WEAR
(uuid_generate_v4(), 'African Heritage Kaftan', 'african-heritage-kaftan', 'Stunning kaftan featuring traditional African motifs with modern tailoring. Perfect for cultural celebrations.', (SELECT id FROM public.categories WHERE slug = 'kaftans'), 'KAFTAN', 380000, true, false, '["/images/malipula/service3.jpg"]', '/images/malipula/service3.jpg', '["traditional", "cultural", "premium"]'),
(uuid_generate_v4(), 'Royal Kente Ensemble', 'royal-kente-ensemble', 'Authentic kente cloth ensemble for weddings and special ceremonies. A true statement piece.', (SELECT id FROM public.categories WHERE slug = 'traditional-wear'), 'SUIT', 850000, true, true, '["/images/malipula/service4.jpg"]', '/images/malipula/service4.jpg', '["kente", "wedding", "traditional", "premium"]'),
(uuid_generate_v4(), 'Modern Dashiki Set', 'modern-dashiki-set', 'Contemporary dashiki with matching trousers. Comfortable and stylish.', (SELECT id FROM public.categories WHERE slug = 'traditional-wear'), 'SHIRT', 180000, false, false, '["/images/malipula/service3.jpg"]', '/images/malipula/service3.jpg', '["dashiki", "casual", "cultural"]'),

-- TROUSERS
(uuid_generate_v4(), 'Tailored Dress Trousers', 'tailored-dress-trousers', 'Perfectly fitted dress trousers with premium wool blend fabric.', (SELECT id FROM public.categories WHERE slug = 'trousers'), 'TROUSERS', 250000, false, false, '["/images/malipula/service1.jpg"]', '/images/malipula/service1.jpg', '["formal", "tailored", "business"]'),
(uuid_generate_v4(), 'Classic Chinos', 'classic-chinos', 'Versatile chinos for smart casual occasions.', (SELECT id FROM public.categories WHERE slug = 'trousers'), 'TROUSERS', 150000, false, true, '["/images/malipula/service2.jpg"]', '/images/malipula/service2.jpg', '["casual", "chinos", "everyday"]'),

-- BLAZERS
(uuid_generate_v4(), 'Navy Blazer', 'navy-blazer', 'Classic navy blazer suitable for any occasion. Versatile and timeless.', (SELECT id FROM public.categories WHERE slug = 'blazers'), 'BLAZER', 350000, true, false, '["/images/malipula/service1.jpg"]', '/images/malipula/service1.jpg', '["blazer", "classic", "versatile"]'),
(uuid_generate_v4(), 'Linen Summer Blazer', 'linen-summer-blazer', 'Lightweight linen blazer for warm weather elegance.', (SELECT id FROM public.categories WHERE slug = 'blazers'), 'BLAZER', 280000, false, true, '["/images/malipula/service2.jpg"]', '/images/malipula/service2.jpg', '["summer", "linen", "lightweight"]');

-- ============================================
-- PROMOTIONS
-- ============================================

INSERT INTO public.promotions (code, name, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, per_user_limit, start_date, end_date, is_active) VALUES
('WELCOME10', 'Welcome Discount', '10% off your first order', 'PERCENTAGE', 10, 100000, 50000, 1000, 1, NOW(), NOW() + INTERVAL '1 year', true),
('WEDDING15', 'Wedding Season Special', '15% off wedding attire', 'PERCENTAGE', 15, 500000, 150000, 500, 2, NOW(), NOW() + INTERVAL '6 months', true),
('SUMMER20', 'Summer Sale', '20% off summer collection', 'PERCENTAGE', 20, 200000, 100000, 300, 1, NOW(), NOW() + INTERVAL '3 months', true),
('FLAT50K', 'Flat Discount', 'TZS 50,000 off orders above TZS 300,000', 'FIXED_AMOUNT', 50000, 300000, 50000, 200, 1, NOW(), NOW() + INTERVAL '2 months', true);

-- ============================================
-- DONE! Seed data inserted.
-- ============================================
