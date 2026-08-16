import { id } from "@instantdb/react";
import { db } from "../lib/instant";

export const useReactions = (imageId: string) => {
  const { data, isLoading, error } = db.useQuery({
    reactions: {
      $: {
        where: {
          imageId,
        },
      },
    },
  });

  const addReaction = async (emoji: string) => {
    await db.transact(
      db.tx.reactions[id()].create({
        imageId,
        emoji,
        createdAt: new Date(),
      }),
    );
  };

  const reactionCounts = (data?.reactions ?? []).reduce<
    Record<string, number>
  >((counts, reaction) => {
    counts[reaction.emoji] =
      (counts[reaction.emoji] ?? 0) + 1;

    return counts;
  }, {});

  return {
    reactions: data?.reactions ?? [],
    reactionCounts,
    isLoading,
    error,
    addReaction,
  };
};