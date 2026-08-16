import type {
  GalleryImage,
  UnsplashImage,
} from "../types/types";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos";

export const getImages = async (): Promise<GalleryImage[]> => {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const response = await fetch(
    `${UNSPLASH_API_URL}?page=1&per_page=20&client_id=${accessKey}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch images from Unsplash");
  }

  const data = await response.json();

  return data.map((image: UnsplashImage) => ({
    id: image.id,
    description: image.description,
    imageUrl: image.urls.regular,
    width: image.width,
    height: image.height,
  }));
};