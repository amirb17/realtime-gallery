import { useInfiniteQuery } from "@tanstack/react-query";
import { getImages } from "../services/unsplash";

export const useImages = () => {
  return useInfiniteQuery({
    queryKey: ["images"],
    queryFn: ({ pageParam }) => getImages(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
  if (lastPage.length === 0) {
    return undefined;
  }

  return allPages.length + 1;
},
  });
};