export type AppStore = {
  selectedImageId: string | null;
  isViewerOpen: boolean;
  setSelectedImageId: (imageId: string | null) => void;
  setViewerOpen: (isOpen: boolean) => void;
};