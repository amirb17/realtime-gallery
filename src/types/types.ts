export type AppStore = {
  selectedImageId: string | null;
  isViewerOpen: boolean;
  setSelectedImageId: (imageId: string | null) => void;
  setViewerOpen: (isOpen: boolean) => void;
};
export type GalleryImage = {
  id: string;
  description: string | null;
  imageUrl: string;
  width: number;
  height: number;
};//what we want to use in our app, we don't need all the data that unsplash sends back

export type UnsplashImage = {
  id: string;
  description: string | null;
  urls: {
    regular: string;
  };
  width: number;
  height: number;
};//what unsplash sends back to us when we fetch images

export type ImageCardProps = {
  image: GalleryImage;
  onClick: () => void;
};

export type ImageGridProps = {
  images: GalleryImage[];
  onImageClick: (imageId: string) => void;
};

export type ImageViewerProps = {
  image: GalleryImage;
  onClose: () => void;
};