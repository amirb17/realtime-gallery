import { useState } from "react";
import type { ImageCardProps } from "../../types/types";
import ReactionBar from "./ReactionBar";

const ImageCard = ({ image, onClick }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-transform duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-200">
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        <img
          src={image.imageUrl}
          alt={image.description ?? "Gallery image"}
          onLoad={() => setIsLoaded(true)}
          className={`h-64 w-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <ReactionBar imageId={image.id} />
    </article>
  );
};

export default ImageCard;