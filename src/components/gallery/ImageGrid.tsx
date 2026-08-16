import type { ImageGridProps } from "../../types/types";
import ImageCard from "./ImageCard";

const ImageGrid = ({
  images,
  onImageClick,
}: ImageGridProps) => {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={() => onImageClick(image.id)}
        />
      ))}
    </section>
  );
};

export default ImageGrid;