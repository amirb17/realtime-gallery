
import type { ImageCardProps } from "../../types/types";
import ReactionBar from "./ReactionBar";

const ImageCard = ({ image, onClick }: ImageCardProps) => {
  return (
    <article
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      <div className="h-64 w-full overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.description ?? "Gallery image"}
          className="h-full w-full object-cover"
        />
      </div>

      <ReactionBar imageId={image.id} />
    </article>
  );
};

export default ImageCard;

