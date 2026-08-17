import { useState } from "react";
import EmojiPicker, {
  type EmojiClickData,
} from "emoji-picker-react";
import { useReactions } from "../../hooks/useReactions";

const emojis = ["❤️", "😂", "🔥", "😍"];

interface ReactionBarProps {
  imageId: string;
}

const ReactionBar = ({ imageId }: ReactionBarProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const { reactionCounts, addReaction } = useReactions(imageId);

  const displayedEmojis = [
    ...emojis,
    ...Object.keys(reactionCounts).filter(
      (emoji) => !emojis.includes(emoji),
    ),
  ];

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    addReaction(emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div
      className="relative w-full overflow-hidden px-1 py-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex w-full items-center justify-between gap-1">
        {displayedEmojis.slice(0, 4).map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => addReaction(emoji)}
            className="flex cursor-pointer items-center gap-1 rounded-md bg-transparent px-1.5 py-1 text-sm transition-transform duration-200 hover:scale-110"
          >
            <span className="text-base leading-none">
              {emoji}
            </span>

            <span className="text-sm leading-none text-gray-700">
              {reactionCounts[emoji] ?? 0}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowPicker((current) => !current)}
          className="flex cursor-pointer items-center justify-center rounded-md bg-transparent px-1 py-1 text-lg leading-none text-gray-700 transition-transform duration-200 hover:scale-110"
          aria-label="Open emoji picker"
        >
          +
        </button>
      </div>

      {showPicker && (
        <div className="absolute bottom-full left-1 z-50 mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ReactionBar;

