import { Container } from "@/components/ui/container";

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
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#F7F7F7] border border-[#E5E5E5] h-8 w-24 shrink-0"
            />
          ))}
        </div>

        {/* Main Content Layout Skeleton */}
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Sidebar Skeleton (Desktop) */}
          <div className="border-[#E5E5E5] hidden w-60 shrink-0 space-y-6 border bg-white p-5 lg:block">
            <div className="bg-[#E5E5E5] h-4 w-24" />
            <div className="space-y-2.5 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#F7F7F7] h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="w-full flex-1">
            <div className="border-[#E5E5E5] mb-6 flex items-center justify-between border-b pb-4">
              <div className="bg-[#F7F7F7] h-4 w-28" />
              <div className="bg-[#F7F7F7] h-8 w-36" />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="bg-[#F7F7F7] mb-3 aspect-[4/5] w-full" />
                  <div className="bg-[#F7F7F7] mb-2 h-3 w-16" />
                  <div className="bg-[#E5E5E5] mb-2 h-4 w-3/4" />
                  <div className="bg-[#E5E5E5] h-3.5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
