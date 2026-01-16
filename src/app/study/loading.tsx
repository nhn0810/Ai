import PageHeader from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function Loading() {
  return (
    <>
      <PageHeader title="스터디" />
      <div className="pt-20 p-4 space-y-4">
        {/* Filter Buttons Skeleton */}
        <div className="flex gap-2 mb-4">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        {/* Study Card Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-end mt-4">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
