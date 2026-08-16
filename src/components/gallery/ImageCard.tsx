import type { ImageCardProps } from "../../types/types";

const ImageCard = ({ image, onClick }: ImageCardProps) => {
  return (
    <article
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={onClick}
    >
      <img
        src={image.imageUrl}
        alt={image.description ?? "Gallery image"}
        className="h-64 w-full object-cover"
      />

      {image.description && (
        <p className="p-3 text-sm text-gray-700">
          {image.description}
        </p>
      )}
    </article>
  );
};

export default ImageCard;