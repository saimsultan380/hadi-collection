# Hadi Collection — Bulk Product & Multi-Image Import Guide

Guide on how to add multiple products with multiple images (5–6 photos each) to your Hadi Collection store using the automated bulk import system.

---

## 1. Quick Workflow Overview

```
1. Add product rows to `product-data-template.csv`
2. Save your photos into `product-images/` folder (e.g. `mehar-clutch-1.jpg`, `mehar-clutch-2.jpg`)
3. Run `npm run import:products`
4. Products appear on your website with multiple images gallery & automated SEO alt text!
```

---

## 2. Image Naming Convention

Save your product images inside the `product-images/` folder at the root of the project.

Name each image using the product's `imagePrefix` followed by a hyphen and its display sequence number:

| File Name | Display Order | Purpose |
| :--- | :---: | :--- |
| `mehar-clutch-1.jpg` | **1st** | **Main cover photo** (shown on catalog & primary gallery view) |
| `mehar-clutch-2.jpg` | **2nd** | Side profile / angle view |
| `mehar-clutch-3.jpg` | **3rd** | Interior lining & compartment view |
| `mehar-clutch-4.jpg` | **4th** | Hardware / lock / stitching close-up |
| `mehar-clutch-5.jpg` | **5th** | On-model / styled perspective |
| `mehar-clutch-6.jpg` | **6th** | Back side / base view |

> **Note:** Supported image formats are `.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif`.

---

## 3. CSV Template Columns Explained

Edit `product-data-template.csv` using Excel, Google Sheets, or any text editor:

| Column Header | Required? | Example | Description |
| :--- | :---: | :--- | :--- |
| `name` | **Yes** | `Mehar Embroidered Box Clutch` | Full product title |
| `price` | **Yes** | `4500` | Selling price in PKR (numbers only) |
| `compareAtPrice` | Optional | `5999` | Original strike-through price if on sale |
| `category` | **Yes** | `Evening Clutches` | Category (Tote Bags, Shoulder Bags, Crossbody Bags, Festive Potli Bags, Evening Clutches) |
| `occasion` | Optional | `Eid/Festive,Wedding/Formal` | Comma-separated occasions |
| `description` | Optional | `Handcrafted zardozi velvet clutch...` | Full product description |
| `shortDescription`| Optional | `Exquisite festive box clutch with chain strap.` | Short summary for cards and search snippets (max 160 chars) |
| `material` | Optional | `Velvet with Hand Zardozi & Gold Metal Frame` | Bag material specifications |
| `dimensions` | Optional | `8in (W) x 5in (H) x 2.5in (D)` | Bag measurements |
| `stockStatus` | **Yes** | `In Stock` | `In Stock`, `Low Stock`, or `Out of Stock` |
| `isFeatured` | Optional | `true` | `true` or `false` (shows in New Arrivals / Featured) |
| `isBestSeller` | Optional | `true` | `true` or `false` (adds Best Seller badge) |
| `imagePrefix` | **Yes** | `mehar-clutch` | Prefix matching your image files in `product-images/` |

---

## 4. Running the Import Commands

### 🔍 Preview Import (Dry-Run — No changes made)
```bash
npm run import:products:dry
```

### 🚀 Live Bulk Import to Store & Sanity CMS
```bash
npm run import:products
```

### 📁 Custom CSV File Import
```bash
node scripts/import-products.mjs --file=my-eid-collection.csv
```

---

## 5. What the Import System Handles Automatically

- 🖼️ **Multiple Images Upload**: Automatically uploads up to 6+ images per product.
- 🎯 **Automated Google Image SEO**: Generates rich, descriptive `alt` tags for every single photo.
- 📁 **Automatic Category Creation**: If a category doesn't already exist in Sanity, it creates it automatically.
- 🔗 **SEO Title & Description**: Generates optimized meta tags for search engines.
