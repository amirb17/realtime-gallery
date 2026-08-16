import { useState } from "react";
import { id } from "@instantdb/react";
import { db } from "../lib/instant";

export const useComments = (imageId: string) => {
  const [commentText, setCommentText] = useState("");

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

    await db.transact(
      db.tx.comments[id()].create({
        imageId,
        text,
        createdAt: new Date(),
      }),
    );

    setCommentText("");
  };

  return {
    comments: data?.comments ?? [],
    isLoading,
    error,
    commentText,
    setCommentText,
    addComment,
  };
};