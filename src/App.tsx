import { useEffect, useRef, useState } from "react";
import { useImages } from "./hooks/useImages";
import ImageGrid from "./components/gallery/ImageGrid";
import ImageViewer from "./components/gallery/ImageViewer";


function App() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    null,
  );

const {
  data,
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useImages();

const images = data?.pages.flatMap((page) => page) ?? [];

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
  );

  const target = document.querySelector("#load-more");

  if (target) {
    observer.observe(target);
  }

  return () => {
    observer.disconnect();
  };
}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <main className="p-8">
        <p>Loading images...</p>
      </main>
    );
  }

  if (isError) {
  return (
    <main className="p-8">
      <p>
        Error:{" "}
        {error instanceof Error
          ? error.message
          : "Something went wrong"}
      </p>
    </main>
  );
}

  const selectedImage = images?.find(
    (image) => image.id === selectedImageId,
  );

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Realtime Gallery
      </h1>

      <ImageGrid
        images={images ?? []}
        onImageClick={setSelectedImageId}
      />

      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImageId(null)}
        />
      )}
      <div id="load-more" className="h-10" />
    </main>
  );
}

export default App;