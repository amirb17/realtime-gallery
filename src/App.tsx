import GallerySkeleton from "./components/gallery/GallerySkeleton";
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
      <main className="h-screen overflow-hidden bg-gray-50">
        <header className="flex h-[55px] shrink-0 items-center justify-center bg-black">
          <h1 className="text-[20px] font-bold tracking-tight text-white">
            Realtime Gallery
          </h1>
        </header>

        <div className="h-[calc(100vh-55px)] overflow-hidden">
          <section className="h-full overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:w-[70%]">
            <GallerySkeleton />
          </section>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center">
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
    <main className="h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="flex h-[55px] shrink-0 items-center justify-center bg-black px-3 text-white sm:px-6 lg:px-8">
        <h1 className="text-[20px] font-bold tracking-tight text-white">
          Realtime Gallery
        </h1>
      </header>

      {/* Main workspace */}
      <div className="relative h-[calc(100vh-55px)]">
        {/* Gallery */}
        <section
          className="
            h-[72%]
            overflow-y-auto
            px-3
            py-4
            sm:px-6
            sm:py-6
            lg:h-full
            lg:w-[70%]
            lg:px-6
            lg:py-6
          "
        >
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

        {/* Desktop Activity Feed */}
        <aside
          className="
            hidden
            lg:absolute
            lg:right-0
            lg:top-0
            lg:block
            lg:h-full
            lg:w-[30%]
            lg:min-h-0
            lg:overflow-hidden
            lg:px-6
            lg:pt-6
            lg:pb-2
          "
        >
          <ActivityFeed />
        </aside>

        {/* Mobile Activity Feed */}
        <aside
          className="
            fixed
            bottom-0
            left-0
            z-40
            block
            h-[28%]
            w-full
            overflow-hidden
            border-t
            border-gray-200
            bg-gray-50
            px-3
            py-3
            shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
            lg:hidden
          "
        >
          <ActivityFeed />
        </aside>
      </div>

      {/* Image Viewer */}
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