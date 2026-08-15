import { create } from "zustand";
import type { AppStore } from "../types/types";

export const useAppStore = create<AppStore>((set) => ({
  selectedImageId: null,
  isViewerOpen: false,

  setSelectedImageId: (imageId) =>
    set({ selectedImageId: imageId }),

  setViewerOpen: (isOpen) =>
    set({ isViewerOpen: isOpen }),
}));