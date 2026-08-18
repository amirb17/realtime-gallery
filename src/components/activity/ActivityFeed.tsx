import { useActivities } from "../../hooks/useActivities";

const ActivityFeed = () => {
  const {
    activities,
    isLoading,
    error,
  } = useActivities();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading activity...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load activity.
        </p>
      </div>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <h2
        className="
          mb-2
          shrink-0
          px-1
          text-xl
          font-bold
          text-gray-900
          sm:mb-3
          sm:text-2xl
        "
      >
        Activity Feed
      </h2>

      <div
        className="
          min-h-0
          flex-1
          space-y-2
          overflow-y-auto
          pb-1
          pr-1
          sm:space-y-3
          sm:pr-2
        "
      >
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="
              activity-enter
              rounded-xl
              bg-white
              px-3
              py-2.5
              text-sm
              shadow-sm
              transition-shadow
              hover:shadow-md
              sm:px-4
              sm:py-4
              sm:text-base
            "
          >
            {activity.type === "reaction" && (
              <p className="break-words">
                {activity.userName ?? "Someone"} reacted{" "}
                {activity.emoji} to an image.
              </p>
            )}

            {activity.type === "comment" && (
              <p className="break-words">
                {activity.userName ?? "Someone"} commented: "
                {activity.text}"
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivityFeed;