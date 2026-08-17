import { useActivities } from "../../hooks/useActivities";

const ActivityFeed = () => {
  const {
    activities,
    isLoading,
    error,
  } = useActivities();

  if (isLoading) {
    return <p>Loading activity...</p>;
  }

  if (error) {
    return <p>Failed to load activity.</p>;
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">
        Activity Feed
      </h2>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="activity-enter rounded-lg bg-white p-4 shadow"          >
            {activity.type === "reaction" && (
              <p>
                {activity.userName ?? "Someone"} reacted {activity.emoji} to an image.
                
              </p>
            )}

            {activity.type === "comment" && (
              <p>
              {activity.userName ?? "Someone"} commented: "{activity.text}"              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivityFeed;