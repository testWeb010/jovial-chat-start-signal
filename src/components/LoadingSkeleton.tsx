import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCardSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
    <Skeleton className="w-full aspect-[4/3] bg-gray-800" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800" />
      <Skeleton className="h-4 w-1/2 mb-2 bg-gray-800" />
      <Skeleton className="h-16 w-full mb-4 bg-gray-800" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 bg-gray-800" />
        <Skeleton className="h-6 w-20 bg-gray-800" />
        <Skeleton className="h-6 w-14 bg-gray-800" />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12 bg-gray-800" />
          <Skeleton className="h-4 w-12 bg-gray-800" />
        </div>
        <Skeleton className="h-4 w-16 bg-gray-800" />
      </div>
    </div>
  </div>
);

export const VideoCardSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
    <div className="relative">
      <Skeleton className="w-full aspect-video bg-gray-800" />
      <Skeleton className="absolute bottom-2 right-2 h-6 w-12 bg-gray-700" />
    </div>
    <div className="p-4">
      <Skeleton className="h-5 w-full mb-2 bg-gray-800" />
      <Skeleton className="h-4 w-2/3 mb-2 bg-gray-800" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16 bg-gray-800" />
        <Skeleton className="h-4 w-20 bg-gray-800" />
      </div>
    </div>
  </div>
);

export const ProjectGridSkeleton = () => (
  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);

export const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <VideoCardSkeleton key={i} />
    ))}
  </div>
);