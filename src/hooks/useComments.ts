import { useState } from "react";
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

export const useComments = (imageId: string) => {
  const [commentText, setCommentText] = useState("");

  const userId = getUserId();

  const { data, isLoading, error } = db.useQuery({
    comments: {
      $: {
        where: {
          imageId,
        },
      },
    },
  });

  const addComment = async () => {
    const text = commentText.trim();

    if (!text) {
      return;
    }

    await db.transact([
      db.tx.comments[id()].create({
        imageId,
        userId,
        text,
        createdAt: new Date(),
      }),

      db.tx.activities[id()].create({
        imageId,
        type: "comment",
        text,
        createdAt: new Date(),
      }),
    ]);

    setCommentText("");
  };

  const deleteComment = async (commentId: string) => {
    const comment = (data?.comments ?? []).find(
      (item) => item.id === commentId,
    );

    if (!comment || comment.userId !== userId) {
      return;
    }

    await db.transact(
      db.tx.comments[commentId].delete(),
    );
  };

  return {
    comments: data?.comments ?? [],
    isLoading,
    error,
    commentText,
    setCommentText,
    addComment,
    deleteComment,
    userId,
  };
};