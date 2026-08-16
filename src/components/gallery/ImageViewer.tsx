import type { ImageViewerProps } from "../../types/types";

const ImageViewer = ({ image, onClose }: ImageViewerProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-lg bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xl text-white"
          aria-label="Close image viewer"
        >
          ×
        </button>

        <img
          src={image.imageUrl}
          alt={image.description ?? "Gallery image"}
          className="max-h-[80vh] w-auto object-contain"
        />

        {image.description && (
          <p className="p-4 text-sm text-gray-700">
            {image.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;