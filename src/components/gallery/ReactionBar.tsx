import { useReactions } from "../../hooks/useReactions";

const emojis = ["❤️", "😂", "🔥", "😍"];

interface ReactionBarProps {
  imageId: string;
}

const ReactionBar = ({ imageId }: ReactionBarProps) => {
  const { reactionCounts, addReaction } =
    useReactions(imageId);

  return (
    <div
      className="flex flex-wrap gap-2 p-3"
      onClick={(event) => event.stopPropagation()}
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => addReaction(emoji)}
          className="rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
        >
          {emoji} {reactionCounts[emoji] ?? 0}
        </button>
      ))}
    </div>
  );
};

export default ReactionBar;