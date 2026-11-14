# How to Manage Hadi Collection Content & Products
*(Hadi Collection Website Ko Manage Karne Ka Aasan Tareeqa)*

This guide explains how to manage products, categories, pricing, stock, testimonials, and images directly in the project files without needing any external CMS.

---

## Quick Reference Summary

| Action | File to Edit | Key Fields |
| :--- | :--- | :--- |
| **Add or Edit Product** | `data/products.ts` | `name`, `slug`, `price`, `images`, `stockStatus` |
| **Add or Edit Category** | `data/categories.ts` | `title`, `slug`, `image`, `isActive` |
| **Add Product Images** | `public/images/products/[slug]/` | JPG, PNG, or WebP files |
| **Add Category Images** | `public/images/categories/` | JPG, PNG, or WebP files |
| **Remove Demo Products** | Terminal: `npm run remove-demo` | Safely removes all `isDemo: true` items |
| **Validate Data** | Terminal: `npm run check-data` | Checks slugs, images, categories, styles |
| **Testimonials** | Admin Panel: `/admin/testimonials` | Real customer reviews & WhatsApp screenshots |
| **Product Reviews** | Supabase: Table Editor → `reviews` | Toggle `approved` to true/false or delete row |
| **Order Status** | Supabase: Table Editor → `orders` | Change `status` (`pending`, `confirmed`, etc.) |

---

## 1. How to Add a New Product
*(Naya Product Kaise Add Karein)*

1. **Add Images**:
   - Create a folder inside `public/images/products/[your-product-slug]/`.
   - Place your product photos there (e.g. `front.jpg`, `detail.jpg`).
   - *(Image ko `public/images/products/[slug]/` folder mein rakhein)*.

2. **Open `data/products.ts`**:
   - Scroll to the `PRODUCTS` array and add a new product entry:

```typescript
{
  _id: "prod-emerald-tote",
  name: "Emerald Luxury Tote",
  slug: "emerald-luxury-tote",
  category: cat("tote-bags"), // Use slug of an existing category
  occasion: ["Everyday", "Office/Professional"],
  styles: [], // Leave empty if category doesn't have styles
  price: 4800, // Current selling price in PKR
  compareAtPrice: 6500, // Optional: Original price before discount
  shortDescription: "Handcrafted structured emerald tote bag with custom gold hardware.",
  description: "Made from premium textured vegan leather with double reinforced shoulder straps.",
  material: "Textured Vegan Leather",
  dimensions: "15in (W) x 12in (H) x 5in (D)",
  stockStatus: "In Stock", // "In Stock" | "Low Stock" | "Out of Stock"
  isBestSeller: false, // Set to true to feature on homepage bestsellers
  isDemo: false, // Always set false for your real products
  images: [
    {
      asset: { url: "/images/products/emerald-luxury-tote/front.jpg" },
      alt: "Emerald Luxury Tote front view",
    },
    {
      asset: { url: "/images/products/emerald-luxury-tote/detail.jpg" },
      alt: "Emerald Luxury Tote detail close-up",
    },
  ],
  colorVariants: [
    { colorName: "Emerald Green", colorHex: "#1B4D3E" },
    { colorName: "Classic Black", colorHex: "#111111" },
  ],
},
```

---

## 2. How to Edit a Price or Put an Item on Sale
*(Price Kaise Change Karein Ya Sale Par Kaise Lagayein)*

Open `data/products.ts` and locate the product:

- **Regular Price Change**:
  ```typescript
  price: 4200, // New price
  ```

- **Put on Sale** *(Sale tag will automatically appear with calculated discount %)*:
  ```typescript
  price: 3500,        // Sale discount price
  compareAtPrice: 5000, // Original cut-off price
  ```

- **Remove from Sale**:
  Remove the `compareAtPrice` line or set it to undefined.

---

## 3. How to Mark an Item Sold Out or Low Stock
*(Product Ko Out of Stock Ya Low Stock Kaise Karein)*

In `data/products.ts`, change `stockStatus`:

- **In Stock**:
  ```typescript
  stockStatus: "In Stock",
  ```
- **Low Stock** *(Shows urgency label on product page)*:
  ```typescript
  stockStatus: "Low Stock",
  ```
- **Sold Out** *(Disables Add to Bag button and displays SOLD OUT badge)*:
  ```typescript
  stockStatus: "Out of Stock",
  ```

---

## 4. How to Add a New Category
*(Nayi Category Kaise Banayein)*

1. Save cover photo in `public/images/categories/[slug].jpg`.
2. Open `data/categories.ts` and add:

```typescript
{
  _id: "cat-backpacks",
  title: "Backpacks",
  slug: "backpacks",
  description: "Chic and functional backpacks for college, travel, and daily commute.",
  introText: "Chic and functional backpacks for college, travel, and daily commute.",
  displayOrder: 9, // Order in navigation menus
  sortOrder: 9,
  isActive: true, // Set to false to temporarily hide from storefront
  seoTitle: "Best Women Backpacks in Pakistan | Hadi Collection",
  seoDescription: "Shop luxury women backpacks in Pakistan. Cash on delivery & 7-day returns.",
  image: {
    asset: { url: "/images/categories/backpacks.jpg" },
    alt: "Hadi Collection Backpacks Collection",
  },
},
```

### Allowed Styles by Category:
If adding sub-styles, check `lib/category-styles.ts`:
- **Shoulder Bags**: `"hobo"`, `"baguette"`
- **Crossbody Bags**: `"sling"`, `"mini-bag"`
- **Top Handle Bags**: `"satchel"`, `"box-bag"`
- **Clutches**: `"envelope"`, `"evening"`, `"party"`, `"embroidered"`
- *(Other categories like Tote Bags or Bucket Bags do not require styles).*

---

## 5. How to Delete All Demo Products
*(Demo Products Ko Kaise Delete Karein)*

When you are ready to remove all 32 seed/demo items and keep only your real products:

1. **Preview first (Dry Run)**:
   ```bash
   npm run remove-demo:dry
   ```
2. **Execute deletion**:
   ```bash
   npm run remove-demo
   ```
   *Note: This automatically creates a backup file (e.g. `data/products.backup.[timestamp].ts`) so your data is never lost.*

---

## 6. How to Add Real Testimonials
*(Asli Customer Feedback Aur WhatsApp Screenshots Kaise Add Karein)*

Testimonials are managed safely and persistently via Supabase:

1. Open your admin panel:
   `https://sazaira.vercel.app/admin/testimonials` (or `http://localhost:3000/admin/testimonials` locally).
2. Click **"+ Add Testimonial"**.
3. Choose **Text Review** or upload a **WhatsApp Screenshot**.
4. Check **"The customer agreed to be shown on the website"** *(Publishing is blocked without customer consent)*.
5. Check **"Publish on Website"**.
6. Click **Create Testimonial**.
   *(Homepage customer feedback section automatically displays as soon as 3 or more real testimonials are published).*

---

## 7. Data Validation & Building
*(Data Check Karna Aur Build Run Karna)*

Before deploying, run the integrity checker:

```bash
npm run check-data
```

This verifies:
- No duplicate product or category slugs
- All referenced image files exist in `/public/`
- All products point to valid categories
- Only valid styles are used for each category

When running `npm run build`, `check-data` runs automatically to ensure zero broken links on production.

---

## 8. How to Approve or Delete Product Reviews
*(Supabase Mein Reviews Ko Approve Ya Delete Kaise Karein)*

Customer reviews are submitted directly to your **Supabase database** with `approved = false`. They will **not** appear on the website until you approve them. You do not need a custom admin dashboard—you can manage them directly inside Supabase in seconds:

### Step-by-Step Approval Process:

1. **Log in to Supabase**:
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your **Hadi Collection** project.

2. **Open the Table Editor**:
   - In the left sidebar, click on the **Table Editor** icon (the spreadsheet/table icon).
   - In the list of tables under `public`, click on **`reviews`**.

3. **View Submitted Reviews**:
   - Each row represents a submitted customer review showing:
     - `name`: Customer name
     - `product_slug`: The product the review belongs to
     - `rating`: Star rating (1 to 5)
     - `title`: Review headline
     - `body`: Review description
     - `approved`: Moderation status (`false` by default)
     - `created_at`: Submission timestamp

4. **To Approve a Review (Publish it)**:
   - Find the review row you want to publish.
   - Double-click on the cell in the **`approved`** column for that row.
   - Toggle or select **`true`** and press **Enter** / click the checkmark to save.
   - ✅ The review is now approved and will automatically display on that product's page with updated star ratings!

5. **To Reject or Delete a Review**:
   - Right-click the row (or check the checkbox on the left side of the row).
   - Click **"Delete 1 row"** (or click the red Trash icon at the top).
   - Confirm deletion.
   - 🗑️ The spam or inappropriate review is permanently removed.

---

## 9. How to Change an Order's Status
*(Supabase Mein Order Ka Status Kaise Change Karein)*

New orders are automatically saved in Supabase with `status = 'pending'`. You can track and update an order's status directly in the Supabase Table Editor:

### Allowed Status Values:
- **`pending`**: Default for newly placed orders (awaiting customer WhatsApp confirmation).
- **`confirmed`**: Order verified with customer on WhatsApp; ready for packing.
- **`cancelled`**: Customer cancelled or fake/unreachable order.
- **`shipped`**: Parcel handed over to courier.
- **`delivered`**: Successfully delivered to customer.

### Step-by-Step in Supabase Table Editor:
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and open your **Hadi Collection** project.
2. In the left sidebar, click **Table Editor** (spreadsheet icon).
3. Select the **`orders`** table under the `public` schema.
4. Locate the order row by `order_number` or customer name.
5. Double-click the cell in the **`status`** column.
6. Type or select the new status (`confirmed`, `cancelled`, `shipped`, or `delivered`) and hit **Enter** to save.
7. The update is saved immediately.
