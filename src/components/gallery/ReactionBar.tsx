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
      className="relative w-full overflow-hidden px-2 py-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="grid grid-cols-5 gap-2">
        {displayedEmojis.slice(0, 4).map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => addReaction(emoji)}
            className="
              flex min-w-0 items-center justify-center gap-1
              rounded-full
              border border-gray-200
              bg-gray-50
              px-2 py-2
              text-sm
              cursor-pointer
              transition-all duration-200
              hover:border-gray-300
              hover:bg-gray-100
              hover:shadow-sm
              active:scale-95
            "
          >
            <span>{emoji}</span>

            <span className="text-xs font-medium text-gray-600">
              {reactionCounts[emoji] ?? 0}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowPicker((current) => !current)}
          className="
            flex h-full min-w-0 items-center justify-center
            rounded-full
            border border-gray-200
            bg-gray-50
            text-lg font-medium
            text-gray-600
            cursor-pointer
            transition-all duration-200
            hover:border-gray-300
            hover:bg-gray-100
            hover:text-gray-900
            hover:shadow-sm
            active:scale-95
          "
          aria-label="Open emoji picker"
        >
          +
        </button>
      </div>

      {showPicker && (
        <div className="absolute bottom-full left-2 z-50 mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ReactionBar;