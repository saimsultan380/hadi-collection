import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductCompleteLook } from "@/components/product/ProductCompleteLook";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductBenefitsStrip } from "@/components/product/ProductBenefitsStrip";
import { ProductRecentlyViewed } from "@/components/product/ProductRecentlyViewed";
import {
  getProductBySlug,
  getRelatedProducts,
  getFeaturedProducts,
  getAccessoryProducts,
  getAllProducts,
} from "@/lib/products";
import { getApprovedReviewsForProduct } from "@/lib/reviews";
import { urlForImage } from "@/lib/image";

// =============================================================================
// PRODUCT DETAIL PAGE ROUTE (/shop/[slug])
// Full editorial presentation of a Hadi Collection handbag with interactive gallery,
// complete product information column, and new organized sections below.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate dynamic SEO metadata and OpenGraph tags for the product.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Hadi Collection",
      description: "The requested suit is no longer available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.seoTitle || `${product.name} | Hadi Collection`;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    `Shop ${product.name} designed for modern Pakistani women by Hadi Collection.`;

  const primaryImage = product.images?.[0];
  const imageUrl = primaryImage
    ? urlForImage(primaryImage)?.width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${slug}`,
    },
    robots: product.isDemo
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/shop/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: primaryImage?.alt || product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Trigger 404 state if product is not found
  if (!product) {
    notFound();
  }

  // 1. Fetch related products from the same category
  const relatedProducts = product.category?.slug
    ? await getRelatedProducts(product.category.slug, product._id)
    : [];

  // Guarantee at least 5 products for recommendations row even if category has few items
  const featured = await getFeaturedProducts();
  const fallbackRecommendations = [
    ...relatedProducts,
    ...featured.filter(
      (f) => f._id !== product._id && !relatedProducts.some((r) => r._id === f._id)
    ),
  ].slice(0, 8);

  // 2. Fetch accessories for Complete The Look
  const accessoryProducts = await getAccessoryProducts(product._id);

  // 3. Fetch real customer reviews from database
  const { reviews, stats: reviewStats } = await getApprovedReviewsForProduct(
    product.slug,
    product._id
  );

  // Prepare full image URLs array for Product Schema
  const schemaImages: string[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      const url = urlForImage(img)?.width(1200).height(1200).url();
      if (url) schemaImages.push(url);
    });
  }

  /**
   * Comprehensive Product JSON-LD Structured Data
   */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${product.slug}#product`,
    name: product.name,
    image: schemaImages.length > 0 ? schemaImages : undefined,
    description:
      product.shortDescription || product.seoDescription || product.name,
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: "Hadi Collection",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stockStatus === "Out of Stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Hadi Collection",
      },
    },
  };

  // BreadcrumbList JSON-LD Schema
  const breadcrumbElements = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: `${SITE_URL}/shop`,
    },
  ];

  if (product.category) {
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 3,
      name: product.category.title,
      item: `${SITE_URL}/category/${encodeURIComponent(product.category.slug)}`,
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 4,
      name: product.name,
      item: `${SITE_URL}/shop/${product.slug}`,
    });
  } else {
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 3,
      name: product.name,
      item: `${SITE_URL}/shop/${product.slug}`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbElements,
  };

  return (
    <div className="min-h-screen bg-white py-6 md:py-10">
      {/* Product JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* BreadcrumbList JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Container>
        {/* Breadcrumbs Navigation */}
        <ProductBreadcrumb
          category={product.category}
          productName={product.name}
        />

        {/* Primary 2-Column Product Detail Layout */}
        <div className="mb-12 md:mb-16">
          <ProductDetailView product={product} reviewStats={reviewStats} />
        </div>

        {/* =========================================================================
            PART 2: NEW SECTIONS BELOW THE PRODUCT AREA
            Full width with 80-100px vertical spacing between sections
            ========================================================================= */}
        <div className="space-y-20 md:space-y-24 border-t border-[#E5E5E5] pt-14 md:pt-20">
          {/* 1. COMPLETE THE LOOK (Hidden if no matching accessories) */}
          {accessoryProducts.length > 0 && (
            <ProductCompleteLook accessories={accessoryProducts} />
          )}

          {/* 2. RECENTLY VIEWED & RECOMMENDED PRODUCTS (Directly above Reviews) */}
          <ProductRecentlyViewed
            currentProduct={product}
            fallbackProducts={fallbackRecommendations}
          />

          {/* 3. CUSTOMER REVIEWS (#reviews) */}
          <ProductReviews
            productId={product._id}
            productSlug={product.slug}
            initialReviews={reviews}
            initialStats={reviewStats}
          />

          {/* 4. BENEFITS STRIP (4 Columns) */}
          <ProductBenefitsStrip />
        </div>
      </Container>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}
