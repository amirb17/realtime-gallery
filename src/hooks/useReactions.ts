import { id } from "@instantdb/react";
import { db } from "../lib/instant";

const getUserId = () => {
  const existingUserId = localStorage.getItem("gallery-user-id");

  if (existingUserId) {
    return existingUserId;
  }

  const newUserId = crypto.randomUUID();

  localStorage.setItem("gallery-user-id", newUserId);

  return newUserId;
};

export const useReactions = (imageId: string) => {
  const userId = getUserId();

  const { data, isLoading, error } = db.useQuery({
    reactions: {
      $: {
        where: {
          imageId,
        },
      },
    },
  });

  const reactions = data?.reactions ?? [];

  const addReaction = async (emoji: string) => {
    const existingReaction = reactions.find(
      (reaction) =>
        reaction.emoji === emoji &&
        reaction.userId === userId,
    );

    if (existingReaction) {
      await db.transact(
        db.tx.reactions[existingReaction.id].delete(),
      );

      return;
    }

    await db.transact(
      db.tx.reactions[id()].create({
        imageId,
        emoji,
        userId,
        createdAt: new Date(),
      }),
    );
  };

  const reactionCounts = reactions.reduce<Record<string, number>>(
    (counts, reaction) => {
      counts[reaction.emoji] =
        (counts[reaction.emoji] ?? 0) + 1;

      return counts;
    },
    {},
  );

  return {
    reactions,
    reactionCounts,
    isLoading,
    error,
    addReaction,
  };
};