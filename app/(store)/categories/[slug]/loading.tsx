import { Container } from "@/components/ui/container";

// =============================================================================
// CATEGORY PAGE LOADING SKELETON
// Flat geometric placeholder blocks matching Hadi Collection design standards.
// =============================================================================

export default function CategoryLoading() {
  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="bg-[#F7F7F7] mb-6 h-3.5 w-48" />

        {/* Header Skeleton */}
        <div className="border-[#E5E5E5] mb-8 border-b pb-6">
          <div className="bg-[#F7F7F7] mb-3 h-3.5 w-32" />
          <div className="bg-[#E5E5E5] mb-3 h-10 w-72" />
          <div className="bg-[#F7F7F7] mb-2 h-4 max-w-xl w-full" />
          <div className="bg-[#F7F7F7] h-3.5 w-24" />
        </div>

        {/* Style Quick Filters Skeleton */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#F7F7F7] border border-[#E5E5E5] h-8 w-24 shrink-0" />
          ))}
        </div>

        {/* Toolbar Skeleton */}
        <div className="border-[#E5E5E5] mb-6 flex items-center justify-between border-b pb-4">
          <div className="bg-[#F7F7F7] h-4 w-28" />
          <div className="bg-[#F7F7F7] h-8 w-36" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="bg-[#F7F7F7] mb-3 aspect-[4/5] w-full" />
              <div className="bg-[#F7F7F7] mb-2 h-3 w-16" />
              <div className="bg-[#E5E5E5] mb-2 h-4 w-3/4" />
              <div className="bg-[#E5E5E5] h-3.5 w-20" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
