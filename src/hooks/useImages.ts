import { useQuery } from "@tanstack/react-query";
import { getImages } from "../services/unsplash";

export const useImages = () => {
  return useQuery({
    queryKey: ["images"],
    queryFn: getImages,
  });
};