import { Container } from "@/components/ui/container";

// =============================================================================
// PRODUCT DETAIL PAGE LOADING SKELETON
// Flat solid taupe placeholder blocks with 0 gradients and 0 shimmer animations.
// =============================================================================

export default function ProductDetailLoading() {
  return (
    <div className="bg-white min-h-screen py-8 md:py-14">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="bg-[#F7F7F7] mb-8 h-4 w-64" />

        {/* 2-Column Product Layout Skeleton */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Gallery Skeleton (Span 7) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="border-[#E5E5E5] bg-white p-4">
              <div className="bg-[#F7F7F7] aspect-square w-full" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border-[#E5E5E5] bg-[#F7F7F7] aspect-square border"
                />
              ))}
            </div>
          </div>

          {/* Info & Actions Skeleton (Span 5) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border-[#E5E5E5] space-y-3 border-b pb-6">
              <div className="bg-[#F7F7F7] h-3 w-20" />
              <div className="bg-[#E5E5E5] h-8 w-3/4" />
              <div className="bg-[#E5E5E5] h-6 w-32" />
              <div className="space-y-2 pt-2">
                <div className="bg-[#F7F7F7] h-4 w-full" />
                <div className="bg-[#F7F7F7] h-4 w-5/6" />
              </div>
            </div>

            {/* Variants skeleton */}
            <div className="space-y-3">
              <div className="bg-[#F7F7F7] h-4 w-24" />
              <div className="flex gap-2">
                <div className="bg-[#F7F7F7] h-8 w-20" />
                <div className="bg-[#F7F7F7] h-8 w-20" />
              </div>
            </div>

            {/* CTAs skeleton */}
            <div className="flex gap-4 pt-2">
              <div className="bg-[#F7F7F7] h-12 w-32" />
              <div className="bg-[#E5E5E5] h-12 flex-1" />
            </div>

            {/* Trust badges skeleton */}
            <div className="border-[#E5E5E5] space-y-3 border-t pt-6">
              <div className="bg-[#F7F7F7] h-6 w-full" />
              <div className="bg-[#F7F7F7] h-6 w-full" />
              <div className="bg-[#F7F7F7] h-6 w-full" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
