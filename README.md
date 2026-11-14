# Hadi Collection — E-Commerce Website

> **Women's handbags and purses for modern Pakistani women.**
> Modern · Minimalist · Trendy · Elegant

---

## What is this?

Hadi Collection is a Pakistani e-commerce brand selling women's handbags and purses — from everyday totes and crossbody bags to festive clutches and potli bags for occasions like Eid.

This repository contains the full website codebase, built with **Next.js 15 App Router** and **TypeScript**, with a focus on:

- 🔍 **SEO-first architecture** using React Server Components
- 🎨 **Tailwind CSS** for a clean, luxury design system
- 🧱 **Sanity CMS** integration (coming in Step 2) for easy product management
- ✅ **Type-safe** codebase from day one

---

## Getting Started

### Prerequisites

- Node.js v18 or newer
- npm v9 or newer

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sazaira

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# → Fill in the values in .env.local (see comments inside for guidance)
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Starts the development server at localhost:3000      |
| `npm run build`        | Builds the production bundle (TypeScript + Tailwind) |
| `npm start`            | Runs the production build                            |
| `npm run lint`         | Runs ESLint across the codebase                      |
| `npm run format`       | Formats all files with Prettier                      |
| `npm run format:check` | Checks formatting without writing changes            |

---

## Project Structure

```
/
├── app/                  → All routes and pages (Next.js App Router)
│   ├── (store)/          → Storefront routes (wrapped in Header + Footer)
│   │   ├── layout.tsx    → Storefront layout with Header and Footer
│   │   └── page.tsx      → Homepage (Coming Soon / Hero + Featured)
│   ├── studio/           → Embedded Sanity Studio admin panel (/studio)
│   │   └── [[...tool]]/  → Catch-all dynamic Studio SPA route
│   └── layout.tsx        → Root HTML shell, fonts, and base SEO metadata
│
├── sanity/               → Sanity CMS schemas and configuration
│   ├── env.ts            → Environment variable access & defaults
│   ├── structure.ts      → Custom Studio desk navigation
│   └── schemas/          → Content schemas
│       ├── product.ts    → Handbag & purse schema (pricing, SEO, variants, tags)
│       ├── category.ts   → Product category schema (totes, clutches, etc.)
│       └── index.ts      → Schema types registry
│
├── components/           → All React UI components
│   ├── ui/               → Atomic elements (Button, Badge, Container, etc.)
│   ├── layout/           → Site-wide structure (Logo, Header, Footer)
│   └── sections/         → Page sections (Hero, Featured Products, etc.)
│
├── lib/                  → Utilities and client SDKs
│   ├── utils.ts          → cn() class merge helper
│   └── sanity/           → Sanity client, image builder, and GROQ queries
│       ├── client.ts     → Configured Sanity client instance
│       ├── image.ts      → urlForImage() helper for responsive image URLs
│       └── queries.ts    → GROQ queries for products, categories, collections
│
├── types/                → Shared TypeScript type definitions
│   ├── product.ts        → Product, Category, ColorVariant, SanityImage types
│   └── order.ts          → Order and checkout types
│
├── public/               → Static assets
├── styles/               → Global CSS and design tokens
├── sanity.config.ts      → Sanity Studio root configuration
├── tailwind.config.ts    → Tailwind CSS theme tokens & colors
└── tsconfig.json         → TypeScript strict configuration
```

---

## Sanity CMS Setup Guide

Sanity CMS is embedded directly inside this application at `http://localhost:3000/studio`.

### 1. Create a Free Sanity Account

1. Visit [https://www.sanity.io](https://www.sanity.io) and click **Sign Up** (or log in with Google/GitHub).
2. Go to the [Sanity Management Dashboard](https://www.sanity.io/manage).

### 2. Create a New Project

1. In the dashboard, click **Create project**.
2. Name your project (e.g. `sazaira-store`).
3. Select the **Free Forever** plan.
4. Choose default dataset creation (`production`).

### 3. Copy Your Project Credentials into `.env.local`

1. On your project overview page in Sanity Manage:
   - Copy the **Project ID** (a 8-character string, e.g. `a1b2c3d4`).
2. Open `.env.local` in your project folder and set:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id_here"
   NEXT_PUBLIC_SANITY_DATASET="production"
   NEXT_PUBLIC_SANITY_API_VERSION="2024-03-01"
   ```
3. (Optional) Create an API Token for server mutations:
   - Go to **API** tab → **Tokens** → **Add API token**.
   - Name it `Hadi Collection Server Token`, give it **Editor** permissions, and copy the token into:
     ```env
     SANITY_API_TOKEN="your_token_here"
     ```

### 4. Configure CORS Origins

1. In the Sanity Management Dashboard, navigate to the **API** tab.
2. Under **CORS Origins**, click **Add CORS origin**.
3. Add `http://localhost:3000` and check **Allow credentials**.
4. (When deploying to production, add your production domain, e.g. `https://hadicollection.pk`).

---

## How to Add a Product (Store Admin Guide)

To add or edit products in the catalog without editing any code:

1. **Open the Admin Studio**:
   - Open your browser and navigate to `http://localhost:3000/studio` (or `https://yourdomain.com/studio` in production).
   - Log in with your Sanity account.

2. **First, Create Categories (if not already created)**:
   - Click **Categories & Collections** in the sidebar.
   - Click the pencil/create icon (+).
   - Enter the category title (e.g. `Tote Bags`, `Festive Clutches & Potli Bags`, `Crossbody Bags`).
   - Click **Generate** next to Slug.
   - Upload a cover photo and click **Publish**.

3. **Add a New Handbag / Purse**:
   - Click **All Products (Handbags & Purses)** in the sidebar.
   - Click the create icon (+).
   - Fill in the organized sections:
     - **Basic Information**: Name, click **Generate** for Slug, select Category, pick Occasions (e.g., _Everyday_, _Eid/Festive_), and enter the Selling Price in PKR.
     - **Product Photography**: Upload high-resolution photos of the bag. **Always fill in the "Alt Text" field** on each photo for Google Image SEO.
     - **Color Variants**: (Optional) If the bag comes in multiple colors, add color swatches and matching images.
     - **Bag Details & Specs**: Enter material, dimensions, select stock status (_In Stock_, _Low Stock_, or _Out of Stock_), and check _Feature on Homepage_ or _Eid Collection_ if applicable.
     - **SEO**: (Optional) Customize Google title & description or leave blank to use defaults.
   - Click the green **Publish** button at the bottom right.

---

## Seasonal & Auto-Rotating Homepage Banner System

The promotional banner on the homepage automatically alternates between seasonal festival campaigns and evergreen collection highlights based on the current date, eliminating the need for manual code updates each season.

### How It Operates

- **During Eid Season**: Automatically displays the **Eid Collection** banner (`/shop?occasion=Eid/Festive`) with the gold-accented festive styling.
- **Rest of the Year (Default Evergreen)**: Automatically displays the **Wedding & Formal Collection** banner (`/shop?occasion=Wedding/Formal`) with matching flat luxury aesthetics.

### 📅 How & Where to Update Annual Eid Dates

Because Eid dates follow the Islamic lunar calendar and shift ~10–11 days earlier each Gregorian year, date windows are defined in `lib/seasonalBanner.ts`:

1. Open [`lib/seasonalBanner.ts`](file:///lib/seasonalBanner.ts).
2. Locate the `EID_WINDOWS` array (pre-configured for 2025–2028).
3. To add or adjust dates for upcoming years, append a new object:
   ```typescript
   {
     label: "Eid-ul-Fitr 2029",
     start: "2029-01-31", // Shopping window start (approx 2 weeks before)
     end: "2029-02-22",   // Window end (inclusive)
   },
   ```

### 🔄 How to Switch the Default Evergreen Banner

If you want the banner outside Eid windows to feature **Best Sellers** instead of Wedding & Formal:

1. Open [`lib/seasonalBanner.ts`](file:///lib/seasonalBanner.ts).
2. Change the `DEFAULT_FALLBACK_BANNER` constant (Line 88):
   ```typescript
   export const DEFAULT_FALLBACK_BANNER: "wedding" | "bestsellers" =
     "bestsellers";
   ```

---

## Best Sellers Navigation

The main header includes a permanent **Best Sellers** link pointing to `/shop?bestseller=true`. This is an evergreen nav item standard across fashion e-commerce.

### How Best Sellers Are Determined

Products are surfaced via a **manual curation flag** in Sanity CMS (`isBestSeller` boolean field). This is intentional for the launch phase since there is no real sales history yet.

> **Future automation**: Once order data accumulates in Supabase, this flag can be replaced or supplemented by a computed query — e.g. "most units sold in the last 90 days". The schema field description in Sanity Studio documents this directly.

### ⚡ Action Required: Tag Products as Best Sellers

> After publishing live products to Sanity, go to `/studio` and for each product you want to feature:
>
> 1. Open the product in **All Products (Handbags & Purses)**.
> 2. Scroll to **Bag Details & Specs**.
> 3. Toggle **Best Seller (Manual Highlight)** ON.
> 4. Click **Publish**.

The `/shop?bestseller=true` page will be empty for live CMS products until at least one product is tagged.

### Fallback Catalog

Before any live products are tagged, the built-in fallback catalog pre-marks 4 products as best sellers so the page renders populated during development: _Elysian Structured Leather Tote_, _Noor Embroidered Velvet Potli_, _Zahra Minimalist Flap Crossbody_, and _Layla Gold Accent Box Clutch_.

---

## Project Status

This is a **multi-step build**. Current status:

- [x] **Step 1 — Foundation**: Next.js 15, TypeScript, Tailwind, ESLint, Prettier, project structure, placeholder pages, type definitions
- [x] **Step 2 — Branding & Design System**: Editorial color palette, Playfair Display + Poppins typography, flat UI components (Button, Badge, Container, Logo, Header, Footer), zero gradients/glassmorphism
- [x] **Step 3 — Sanity CMS**: Embedded Studio at `/studio`, schemas for Products & Categories, custom desk structure, image helper, GROQ queries, TypeScript types
- [x] **Step 4 — Homepage**: Full homepage with Hero, Trust Strip, Category Grid, New Arrivals, Eid Collection Banner, Brand Story, Newsletter — live Sanity data with curated fallbacks; ProductCard component; placeholder /shop and /about routes
- [x] **Step 5 — Product Catalog & Filtering**: `/shop` listing page with dynamic Sanity GROQ querying, URL search parameters (`category`, `occasion`, `price`, `sort`), multi-select FilterSidebar, price range preset toggles, SortDropdown, EmptyState, flat loading skeleton, dynamic SEO metadata, and `/shop/[slug]` routing structure
- [x] **Step 6 — Product Detail Pages**: `/shop/[slug]` full detail page with interactive image gallery, thumbnail swapping, color variant swatches, quantity stepper, stock status urgency badges, temporary Add-to-Cart state, specs list, trust badges strip, rich craftsmanship description, "You May Also Like" related products, breadcrumbs, and Schema.org JSON-LD structured data
- [x] **Step 7 — Shopping Cart & Checkout System**: CartContext with localStorage persistence and hydration safety, slide-in CartDrawer from Header with live item count badge, `/cart` page with line item management, `/checkout` page with Zod form validation (Pakistani phone format `03XXXXXXXXX`, city dropdown), Cash on Delivery (COD) & Bank Transfer/EasyPaisa payment flows, order confirmation screen with WhatsApp CTA, and cart clearance
- [x] **Step 8 — Database & Order Persistence**: Real Supabase database integration (`orders` table with RLS), server-side order Route Handler (`/api/orders`) with Zod re-validation and service-role protection, sequential human-friendly order numbering (`SZR-00001`), immutable JSONB cart snapshots, dynamic `/order-confirmation/[orderNumber]` page, full WhatsApp deep link generator for orders and payment proofs, persistent floating WhatsApp support button, `/api/health` keep-alive endpoint, and scheduled GitHub Actions workflow preventing Supabase free-tier pause
- [x] **Step 10 — Policies & Trust Pages (Customer Confidence)**: FAQ accordion with Schema.org FAQPage JSON-LD, comprehensive Shipping Policy, Returns & Exchange Policy (7-day window), Privacy Policy, Terms & Conditions, interactive Contact Form with direct WhatsApp routing, and redesigned 4-column brand Footer
- [ ] **Step 11 — Production Deployment & Polish**: Vercel deployment, custom domain setup, Speed Insights monitoring, production verification

---

## Post-Launch SEO Checklist

To maximize organic search traffic, Google Shopping visibility, and Pakistani regional search rankings after domain deployment, execute the following steps in sequence:

### 1. Production Domain & Environment Setup

- [ ] Set `NEXT_PUBLIC_SITE_URL="https://hadicollection.pk"` (or your custom domain) in your production hosting environment (e.g. Vercel Project Settings).
- [ ] Verify that HTTP automatically redirects to HTTPS and `www.` redirects to the non-`www` apex domain (or vice-versa).
- [ ] Verify that trailing slash redirection works seamlessly (`/shop/` redirects 308/301 to `/shop`).

### 2. Google Search Console (GSC) Verification & Sitemap Submission

- [ ] Open [Google Search Console](https://search.google.com/search-console).
- [ ] Add your domain property (`hadicollection.pk` or URL prefix `https://hadicollection.pk`).
- [ ] Copy your verification token and set it in `.env.local` as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-token"`.
- [ ] In GSC, navigate to **Sitemaps** in the sidebar.
- [ ] Submit `https://hadicollection.pk/sitemap.xml`. Confirm status changes to **Success**.

### 3. Request Immediate Indexing for Priority Landing Pages

- [ ] In GSC URL Inspection tool, inspect and request indexing for:
  - Homepage (`https://hadicollection.pk/`)
  - Catalog (`https://hadicollection.pk/shop`)
  - Main Category Silos (`/shop?category=totes`, `/shop?category=crossbody`, `/shop?category=potli-bags`)
  - Core Brand Pages (`/about`, `/contact`)

### 4. Google Analytics 4 (GA4) & E-Commerce Event Measurement

- [ ] Create a GA4 property for Hadi Collection.
- [ ] Set up Enhanced Measurement (track page views, scrolls, outbound link clicks, site search).
- [ ] Configure E-Commerce events: `view_item_list`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.

### 5. Google Merchant Center (Free Product Listings)

- [ ] Create a free account at [Google Merchant Center](https://merchants.google.com).
- [ ] Claim and verify your website domain.
- [ ] Set up your shipping settings (standard flat Rs. 200 delivery fee across Pakistan).
- [ ] Connect your product feed or upload products to participate in **Free Google Shopping Listings** (a high-intent discovery channel for women's handbags and festive accessories).

### 6. Core Web Vitals & Real User Monitoring (RUM)

- [ ] Enable Vercel Speed Insights on your production project.
- [ ] Test key templates on [Google PageSpeed Insights](https://pagespeed.web.dev):
  - Homepage target: LCP < 2.5s, CLS = 0, INP < 200ms.
  - Product detail page target: LCP < 2.5s, CLS = 0.
- [ ] Verify image optimization via Next.js `<Image />` component with WebP/AVIF format delivery.

### 7. Social Entity Authority & Backlink Foundations

- [x] Link official social profiles (Instagram `@saza_ira`, Facebook `sazairapurse`, TikTok `@saza_ira`, Pinterest `saza_ira`) in the website footer, contact page, and Organization schema `sameAs` array.
- [ ] Ensure Instagram bio and TikTok profile point to `https://hadicollection.pk`.

### 8. Routine Health Monitoring & Audits

- [ ] **Weekly GSC Coverage Review**: Check for any 404 errors, crawl anomalies, or soft 404s.
- [ ] **Enhancements & Rich Results Check**: Verify that "Products", "Breadcrumbs", and "Sitelinks Search Box" sections in GSC show zero errors.
- [ ] **Google Rich Results Test**: Run [Rich Results Test](https://search.google.com/test/rich-results) on sample product pages to ensure Product schema offers, currency, and availability pass with zero warnings.

---

## Supabase Database Setup Guide (Step 8)

Hadi Collection uses **Supabase (PostgreSQL)** for persisting customer orders securely with Row Level Security (RLS) and JSONB snapshot storage.

### 1. Create a Free Supabase Account & Project

1. Visit [https://supabase.com](https://supabase.com) and click **Start your project** (or sign in with GitHub).
2. In the dashboard, click **New Project**.
3. Fill in your project details:
   - **Name**: `sazaira-store`
   - **Database Password**: Set a strong password (save this in your password manager).
   - **Region**: Choose the closest region (e.g. `ap-south-1` Mumbai or `ap-southeast-1` Singapore for fastest latency in Pakistan).
   - **Pricing Plan**: Free Tier.
4. Click **Create new project** and wait ~1 minute for provisioning.

### 2. Configure Environment Variables (`.env.local`)

1. In your Supabase project dashboard, navigate to **Project Settings** (gear icon in the sidebar) → **API** (or **Data API**).
2. Copy the credentials into your local `.env.local` file:

```env
# 1. Project URL (Public) — Safe to expose in the browser
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"

# 2. Anon / Public Key — Safe for client-side queries (protected by RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# 3. ⚠️ SERVICE ROLE KEY — SECRET! MUST NEVER BE EXPOSED TO CLIENT!
# Used ONLY server-side in /api/orders to insert and manage orders securely.
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# 4. WhatsApp Business Number (Pakistani format without +)
NEXT_PUBLIC_WHATSAPP_PHONE="923037321336"
```

> [!WARNING]
> **Security Notice**: Never commit `SUPABASE_SERVICE_ROLE_KEY` to GitHub or expose it in client-side code. This key bypasses Row Level Security. All order creation is strictly performed through our server-side Route Handler at `app/api/orders/route.ts`.

### 3. Run the Database Schema in Supabase SQL Editor

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **+ New query**.
3. Copy and paste the complete script from `supabase/schema.sql` (or copy below) and click **Run**:

```sql
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for fast query lookup
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Public read for order confirmation lookup
DROP POLICY IF EXISTS "Allow public read by order number" ON public.orders;
CREATE POLICY "Allow public read by order number"
    ON public.orders
    FOR SELECT
    USING (true);
```

### Why Storing `items` as JSONB Snapshot is Critical

Instead of merely saving foreign keys to products in Sanity, Hadi Collection saves a full snapshot of the cart items (`slug`, `name`, `price`, `quantity`, `selectedVariant`, `image`) inside the `items` JSONB column.

**Why this is essential for e-commerce integrity:**

- **Price Protection**: If a handbag's price increases from PKR 5,000 to PKR 6,500 next month, historical order records and customer receipts remain 100% accurate.
- **Catalog Independence**: If a seasonal product is deleted or archived from Sanity CMS, customer order history and accounting records are never broken or missing data.
- **Variant Preservation**: The exact color variant selected at purchase time is permanently recorded.

---

## Keeping the Database Active (Supabase Keep-Alive)

On Supabase's Free Tier, projects automatically pause after **7 consecutive days of zero database activity**, which could cause checkout delays if the store experiences quiet periods.

To eliminate this issue without requiring manual intervention:

1. **Lightweight Health Check Endpoint (`app/api/health/route.ts`)**:
   - Executes a zero-data head query against the Supabase `orders` table.
   - Registers active PostgreSQL traffic without modifying or leaking any order data.
2. **Automated GitHub Actions Workflow (`.github/workflows/keep-alive.yml`)**:
   - Automatically runs every 3 days at 04:00 UTC.
   - Pings your live `/api/health` endpoint on schedule.
   - Once deployed to Vercel/production, set the `SITE_URL` repository secret in GitHub Settings → Secrets to `https://your-domain.com`.

---

## How to View & Manage Orders (Store Admin)

Until a dedicated admin dashboard view is built in a future update, store administrators can view and manage all incoming orders directly in Supabase:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and click **Table Editor** (grid icon in sidebar) → **orders**.
3. You will see all real-time order rows with:
   - `order_number` (e.g. `SZR-00001`)
   - `customer_name`, `customer_phone`, `delivery_address`, `city`
   - `payment_method` (`cash-on-delivery` or `bank-transfer`)
   - `items` (click to view the purchased products snapshot)
   - `subtotal`, `delivery_fee`, `total`
   - `status` (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`)
4. To update an order's status (e.g. from `pending` to `confirmed` or `shipped`), double-click the `status` cell and pick the updated status.

---

## Deployment & CI/CD (Step 11)

Hadi Collection is configured for seamless deployment on **Vercel** with automated continuous integration from **GitHub**.

### 1. Environment Variables on Vercel

When deploying to Vercel, configure the following environment variables in **Project Settings > Environment Variables** (for Production, Preview, and Development):

| Variable                        | Description                                  | Source                              |
| :------------------------------ | :------------------------------------------- | :---------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity Studio Project ID                     | Sanity Manage Dashboard             |
| `NEXT_PUBLIC_SANITY_DATASET`    | Sanity Dataset (`production`)                | Sanity Manage Dashboard             |
| `SANITY_API_TOKEN`              | Sanity API Token (Viewer/Editor)             | Sanity Manage > API > Tokens        |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Project URL                         | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Client Key                | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase Service Role Key (Private)          | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_WHATSAPP_PHONE`    | Customer Care WhatsApp (`923037321336`)      | Store Management                    |
| `NEXT_PUBLIC_SITE_URL`          | Live URL (e.g. `https://sazaira.vercel.app`) | Vercel Deployment Domain            |

### 2. Continuous Deployment Workflow

- **Git Push to Deploy**: Any time commits are pushed to the `main` branch on GitHub, Vercel automatically detects changes, executes `npm run build`, and redeploys the live site with zero downtime.
- **Preview Deployments**: Pull requests or feature branches automatically generate preview URLs for visual QA before merging.

### 3. Connecting a Custom Domain (e.g., `hadicollection.pk`)

When ready to connect a custom domain:

1. Go to **Vercel Dashboard → Hadi Collection Project → Settings → Domains**.
2. Add your domain (`hadicollection.pk` and `www.hadicollection.pk`).
3. Follow Vercel's DNS instructions to configure A/CNAME records with your domain registrar.
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel Environment Variables to `https://hadicollection.pk`.
5. Add `https://hadicollection.pk` to Sanity's CORS allowed origins (`manage.sanity.io`).
6. Update the `SITE_URL` secret in GitHub Repository Secrets for the keep-alive workflow.

---

## Project Status & Roadmap

- [x] **Step 1**: Next.js 15 App Router & TypeScript Foundation
- [x] **Step 2**: Brand Design System (Warm Alabaster, Playfair Display + Poppins)
- [x] **Step 3**: Sanity CMS Setup & Embedded Studio (`/studio`)
- [x] **Step 4**: High-Conversion Homepage (Hero, Categories, Eid Banner, Newsletter)
- [x] **Step 5**: Product Catalog, GROQ Filtering & URL Sync (`/shop`)
- [x] **Step 6**: Product Detail Pages, Image Gallery & Variant Selectors (`/shop/[slug]`)
- [x] **Step 7**: Shopping Cart Drawer, Persistent LocalStorage & Dynamic Badge
- [x] **Step 8**: COD & Bank Transfer Checkout, Supabase Order Storage & WhatsApp Dispatch
- [x] **Step 9**: Technical SEO, JSON-LD Schemas, Dynamic XML Sitemap & Robots
- [x] **Step 10**: Brand Trust Pages (About, Contact, Policies, FAQ) & Mobile Optimization
- [x] **Step 11**: Production Build Validation, GitHub Version Control & Vercel Deployment
- [x] **Step 12**: Streamlined Header Navigation (Clickable Shop + Category Dropdown Chevron, New Arrivals, Best Sellers, Sale Filter, Mobile Accordion)
- [x] **Step 13**: Header Enhancement (Top Rotating Announcement Bar, Debounced Live Search Modal & Catalog Search Integration)
- [x] **Step 14**: Advanced Product Image Interactions (Hover-to-Swap on Product Cards, Amazon-style Multi-Thumbnail Gallery with 2.5x Hover-Zoom Lens & Mobile Tap-to-Zoom Modal)

---

## Navigation Architecture (Step 12 & Step 13)

The main storefront header features a clean, focused, flat navigation system designed to maximize shopping discovery and purchase urgency without visual clutter:

### 1. Top Continuous Marquee Ticker (`components/layout/AnnouncementBar.tsx`)
- **Flat Solid Terracotta Aesthetic**: Rendered in brand solid terracotta (`#B5502F`) with crisp ivory/white text for high contrast, warmth, and luxury editorial presence.
- **Continuous Horizontal Marquee**: Messages scroll seamlessly and infinitely from right to left in a single continuous line, separated by clean bullet dividers (`•`), matching the modern e-commerce pattern seen on 1ststep.pk.
- **Pure CSS Keyframe Performance**: Driven by smooth, GPU-accelerated CSS `transform: translate3d(...)` animation with zero JavaScript timers or interval overhead.
- **Pause-on-Hover & Relaxed Scroll Speed**: Tuned to a relaxed, comfortable reading pace (60s loop duration) with hover-to-pause on desktop.
- **How to Edit Announcement Messages**:
  To update or add new announcement messages, edit the `ANNOUNCEMENT_MESSAGES` constant array at the top of [`components/layout/AnnouncementBar.tsx`](file:///e:/Hadi Collection/components/layout/AnnouncementBar.tsx):
  ```tsx
  export const ANNOUNCEMENT_MESSAGES = [
    "Cash on Delivery Available Nationwide",
    "New Arrivals Just Dropped — Shop Now",
    "Easy 7-Day Returns",
    "Elegance in Every Detail — Discover Hadi Collection",
  ] as const;
  ```

### 2. Live Debounced Search Modal (`components/layout/SearchModal.tsx` & `/api/search`)
- **Header Placement**: Positioned immediately before the Cart bag icon on both desktop and mobile headers.
- **Instant Search Overlay**: Opens a flat, focused search modal with auto-focused input, solid espresso backdrop (`bg-espresso/70`), and quick-suggestion pills.
- **Debounced Live Querying (~300ms)**: Queries Sanity CMS (or offline fallback catalog) for products matching the typed keyword across name, description, and category.
- **Live Result Cards**: Displays product thumbnails, product title, category, and formatted PKR pricing with sale discounts.
- **Catalog Integration (`/shop?search=...`)**: Pressing `Enter` or clicking "View all results" navigates to the `/shop` page with dynamic search filtering, custom page headings (`Search: "..."`), eyebrow badges, and BreadcrumbList schemas.
- **Keyboard & Click Controls**: Closes seamlessly on `Escape` key press or clicking outside on the backdrop.

### 3. Main Navigation
1. **Shop (Clickable Link + Category Dropdown Chevron)**:
   - **Clickable Label**: Clicking "SHOP" navigates directly to `/shop` to view the full product catalog.
   - **Chevron Dropdown Toggle**: The adjacent chevron icon toggles the category list on click or hover (desktop), dynamically populated from Sanity CMS schemas (Tote Bags, Crossbody Bags, Shoulder Bags, Festive Potli Bags, Evening Clutches) + "All Handbags" link.
   - **Mobile Drawer Accordion**: On mobile, tapping "SHOP" navigates directly to `/shop`, while tapping the chevron expands the category list in-place as an accordion without losing context.
   - **Zero Noise**: Pure flat ivory background with a 1px border (`border-border`), zero glassmorphism, blur, or shadows.
2. **New Arrivals**: Direct link to `/shop?sort=newest`, activating the catalog's newest-first sorting logic.
3. **Best Sellers**: Direct link to `/shop?bestseller=true`, showcasing top customer favorites.
4. **Sale**: High-visibility link in **terracotta** accent color (`/shop?sale=true`). Filters the catalog to only show genuinely discounted items (`compareAtPrice > price`).

> Note: Secondary links (**About**, **Contact**, **Policies**, **FAQ**) are cleanly housed in the **Footer** and mobile drawer secondary section, keeping the primary header focused on shopping.
### 4. Advanced Product Image Interactions (Step 14)

1. **ProductCard Hover-to-Swap (`components/ui/ProductCard.tsx`)**:
   - **Default & Hover Behavior**: Displays the product's primary image by default. On desktop hover, smoothly crossfades (CSS opacity transition, ~300ms) to reveal the product's secondary image (`images[1]`).
   - **Pre-cached Performance**: Both `<Image>` elements are rendered in the DOM from initial load, ensuring the secondary image is pre-cached by the browser for instant crossfading with zero perceived network delay.
   - **Graceful 1-Image Fallback**: If a product has only 1 image, the secondary image element is omitted, and standard subtle scale hover zoom applies with zero layout shift or broken states.
   - **Mobile Touch Safety**: On mobile/touch devices without cursor hover, cards consistently display the primary image without flickering.

2. **Product Detail Page — Multi-Thumbnail Gallery & Hover-Zoom (`components/product/ProductGallery.tsx`)**:
   - **Amazon-style Layout**: Vertical thumbnail column on the left (desktop) with the main high-resolution image filling the remaining space; responsive horizontal scrollable thumbnail strip positioned below the main image on mobile.
   - **Instant Thumbnail Preview & Selection**: Hovering any thumbnail instantly previews that image; clicking locks the selection. The active thumbnail is styled with a sharp 1px espresso border (`border-espresso`) matching the flat design language.
   - **2.5x Precision Hover-Zoom Lens**: Moving the cursor over the main image on desktop activates a smooth square magnifying lens overlay that tracks cursor coordinates and displays a 2.5× magnified crop via CSS `background-position`.
   - **Optimized Asset Pipeline**: Requests the main image at `1200×1440px`, providing crisp pixel density at 2.5× zoom while reusing the already-loaded image asset as the lens background with zero additional network requests.
   - **Mobile Tap-to-Zoom Modal**: Tapping the main image on mobile opens a full-screen image modal (`bg-espresso/90`) allowing native pinch-to-zoom for close-up fabric and craftsmanship inspection.
   - **Color Variant Integration**: Seamlessly synchronizes with the color swatch selector (`ProductActions`), automatically swapping the active image when a customer selects an alternate variant.

### Next Steps for Store Launch

1. **Content Population**: Add real product photography, pricing, and stock variants via `/studio`.
2. **Custom Domain**: Connect `hadicollection.pk` in Vercel DNS settings once purchased.
3. **Marketing Analytics**: Integrate Meta Pixel and Google Analytics for conversion tracking.

---

_Built with ❤️ for Hadi Collection._
