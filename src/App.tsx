import { useState } from "react";
import { useImages } from "./hooks/useImages";
import ImageGrid from "./components/gallery/ImageGrid";
import ImageViewer from "./components/gallery/ImageViewer";

function App() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    null,
  );

  const {
    data: images,
    isLoading,
    isError,
    error,
  } = useImages();

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
        <p>Error: {error.message}</p>
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
    </main>
  );
}

export default App;