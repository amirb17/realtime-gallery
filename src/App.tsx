import { useEffect } from "react";
import UserSetup from "./components/user/UserSetup";
import { useUserIdentity } from "./hooks/useUserIdentity";
import { useAppStore } from "./store/appStore";
import ActivityFeed from "./components/activity/ActivityFeed";
import { useImages } from "./hooks/useImages";
import ImageGrid from "./components/gallery/ImageGrid";
import ImageViewer from "./components/gallery/ImageViewer";

function App() {
  const { userName } = useUserIdentity();

  const {
    selectedImageId,
    isViewerOpen,
    setSelectedImageId,
    setViewerOpen,
  } = useAppStore();

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
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    });

    const target = document.querySelector("#load-more");

    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!userName) {
    return <UserSetup />;
  }

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

  const selectedImage = images.find(
    (image) => image.id === selectedImageId,
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Realtime Gallery
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
        <section>
          <ImageGrid
            images={images}
            onImageClick={(imageId) => {
              setSelectedImageId(imageId);
              setViewerOpen(true);
            }}
          />

          <div id="load-more" className="h-10" />

          {isFetchingNextPage && (
            <p className="py-4 text-center text-gray-500">
              Loading more images...
            </p>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <ActivityFeed />
        </aside>
      </div>

      {selectedImage && isViewerOpen && (
        <ImageViewer
          image={selectedImage}
          onClose={() => {
            setSelectedImageId(null);
            setViewerOpen(false);
          }}
        />
      )}
    </main>
  );
}

export default App;