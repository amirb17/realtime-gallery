const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg bg-white shadow"
        >
          {/* Image skeleton */}
          <div className="h-64 w-full animate-pulse bg-gray-200" />

          {/* Reaction skeleton */}
          <div className="flex items-center justify-between px-3 py-3">
            {Array.from({ length: 5 }).map((_, itemIndex) => (
              <div
                key={itemIndex}
                className="h-5 w-8 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;