-- =============================================================================
-- SAZAIRA E-COMMERCE — SUPABASE DATABASE SCHEMA (STEP 8)
-- =============================================================================
-- Copy and run this script in the Supabase SQL Editor:
-- Dashboard → Your Project → SQL Editor → New Query → Paste & Run.
-- =============================================================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL,
    order_notes TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash-on-delivery', 'bank-transfer', 'cod', 'bank_transfer')),
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC NOT NULL DEFAULT 200 CHECK (delivery_fee >= 0),
    total NUMERIC NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    confirmation_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_confirmation_token ON public.orders(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies:
-- 🔒 SECURITY ARCHITECTURE:
-- • NO INSERT policy for anon key: All orders MUST be created via Next.js Route Handler (/api/orders)
--   using the server-side SUPABASE_SERVICE_ROLE_KEY. This prevents malicious clients from fabricating
--   orders or manipulating prices/totals from the browser.
-- • SELECT policy: Allows reading orders (used for public order confirmation / lookup).
-- • UPDATE/DELETE: Restricted to Service Role (Admin) only.

DROP POLICY IF EXISTS "Allow public read by order number" ON public.orders;
CREATE POLICY "Allow public read by order number"
    ON public.orders
    FOR SELECT
    USING (true);

-- (Service role key automatically bypasses all RLS policies for server-side admin writes/updates)

-- =============================================================================
-- TESTIMONIALS TABLE
-- =============================================================================
-- Run this in Supabase SQL Editor after the orders table above.
-- =============================================================================

-- 5. Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('text', 'whatsapp_screenshot')),
    customer_name TEXT NOT NULL,
    city TEXT,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    screenshot_image TEXT,
    product_link TEXT,
    is_verified_buyer BOOLEAN NOT NULL DEFAULT false,
    consent_confirmed BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON public.testimonials(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published, consent_confirmed);

-- 7. Enable RLS on testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for testimonials:
-- • Public can read only published+consented testimonials (for homepage rendering)
-- • All writes (INSERT/UPDATE/DELETE) go through API routes using service role key (bypasses RLS)

DROP POLICY IF EXISTS "Allow public read of published testimonials" ON public.testimonials;
CREATE POLICY "Allow public read of published testimonials"
    ON public.testimonials
    FOR SELECT
    USING (is_published = true AND consent_confirmed = true);

-- =============================================================================
-- SUPABASE STORAGE BUCKET FOR TESTIMONIAL SCREENSHOTS
-- =============================================================================
-- Run these in the Supabase SQL Editor (they use the storage extension).
-- Alternatively create the bucket manually: Storage → New bucket → "testimonial-screenshots" → Public.

INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-screenshots', 'testimonial-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read files in the bucket
DROP POLICY IF EXISTS "Public read testimonial screenshots" ON storage.objects;
CREATE POLICY "Public read testimonial screenshots"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'testimonial-screenshots');

-- Allow service role to upload/delete (API routes use service role key, which bypasses RLS anyway)
-- No anon INSERT policy: uploads are server-side only via /api/testimonials/upload

-- =============================================================================
-- REVIEWS TABLE
-- =============================================================================
-- Run this in Supabase SQL Editor:
-- Dashboard → Your Project → SQL Editor → New Query → Paste & Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}'::TEXT[],
    is_verified_buyer BOOLEAN NOT NULL DEFAULT false,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_slug ON public.reviews(product_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_approved_slug ON public.reviews(approved, product_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Security architecture:
-- • NO public INSERT or SELECT policies for the anon key.
-- • All review reads (approved) and writes (pending approval) are executed
--   via server code using the SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
DROP POLICY IF EXISTS "Allow public read of reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert of reviews" ON public.reviews;
