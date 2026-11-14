import { Container } from "@/components/ui/container";

// =============================================================================
// SHOP PAGE LOADING SKELETON
// Flat taupe placeholder blocks with 0 gradients and 0 shimmer animations.
// =============================================================================

export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <Container>
        {/* Header Skeleton */}
        <div className="border-[#E5E5E5] mb-10 border-b pb-6">
          <div className="bg-[#F7F7F7] mb-3 h-4 w-28" />
          <div className="bg-[#E5E5E5] mb-2 h-10 w-64" />
          <div className="bg-[#F7F7F7] h-4 w-36" />
        </div>

        {/* Layout Skeleton */}
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Sidebar Skeleton (Desktop) */}
          <div className="border-[#E5E5E5] hidden w-64 shrink-0 space-y-6 border bg-white p-6 lg:block">
            <div className="bg-[#E5E5E5] h-5 w-24" />
            <div className="space-y-3 pt-2">
              <div className="bg-[#F7F7F7] h-4 w-full" />
              <div className="bg-[#F7F7F7] h-4 w-3/4" />
              <div className="bg-[#F7F7F7] h-4 w-5/6" />
              <div className="bg-[#F7F7F7] h-4 w-2/3" />
            </div>
            <div className="bg-[#E5E5E5] h-5 w-24 pt-4" />
            <div className="space-y-2">
              <div className="bg-[#F7F7F7] h-8 w-full" />
              <div className="bg-[#F7F7F7] h-8 w-full" />
              <div className="bg-[#F7F7F7] h-8 w-full" />
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="w-full flex-1">
            {/* Top bar skeleton */}
            <div className="border-[#E5E5E5] mb-6 flex items-center justify-between border-b pb-4">
              <div className="bg-[#F7F7F7] h-4 w-28" />
              <div className="bg-[#F7F7F7] h-8 w-36" />
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="border-[#E5E5E5] flex flex-col border bg-white p-3"
                >
                  <div className="bg-[#F7F7F7] mb-4 aspect-[4/5] w-full" />
                  <div className="bg-[#F7F7F7] mb-2 h-3 w-16" />
                  <div className="bg-[#E5E5E5] mb-2 h-5 w-3/4" />
                  <div className="bg-[#F7F7F7] mb-4 h-3 w-full" />
                  <div className="bg-[#E5E5E5] mt-auto h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
