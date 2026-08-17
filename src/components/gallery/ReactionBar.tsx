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

  const { reactionCounts, addReaction } =
  useReactions(imageId);

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
      className="relative flex flex-wrap gap-2 p-3"
      onClick={(event) => event.stopPropagation()}
    >
      {displayedEmojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => addReaction(emoji)}
          className="rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
        >
          {emoji} {reactionCounts[emoji] ?? 0}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setShowPicker((current) => !current)}
        className="rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
        aria-label="Open emoji picker"
      >
        +
      </button>

      {showPicker && (
        <div className="absolute bottom-full left-0 z-50 mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ReactionBar;