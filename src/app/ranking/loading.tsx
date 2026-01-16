import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function Loading() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-secondary mb-4">🏆 랭킹</h1>
      <div className="w-full">
        <div className="grid w-full grid-cols-2 mb-4 bg-muted p-1 rounded-lg">
           <div className="h-8 bg-background rounded-md shadow-sm" />
        </div>
        
        <div className="mt-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center rounded-lg bg-white p-3 shadow h-[72px]">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="mx-3 h-10 w-10 rounded-full" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
