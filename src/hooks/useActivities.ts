import { db } from "../lib/instant";

export const useActivities = () => {
  const { data, isLoading, error } = db.useQuery({
    activities: {},
  });

  const activities = [...(data?.activities ?? [])].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  return {
    activities,
    isLoading,
    error,
  };
};