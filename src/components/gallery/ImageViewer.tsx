import ReactionBar from "./ReactionBar";
import type { ImageViewerProps } from "../../types/types";
import { useComments } from "../../hooks/useComments";

const ImageViewer = ({ image, onClose }: ImageViewerProps) => {
  const {
    comments,
    isLoading,
    commentText,
    setCommentText,
    addComment,
  } = useComments(image.id);

  const handleSubmit = async () => {
    await addComment();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-5xl overflow-y-auto rounded-lg bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xl text-white"
          aria-label="Close image viewer"
        >
          ×
        </button>

        <img
          src={image.imageUrl}
          alt={image.description ?? "Gallery image"}
          className="max-h-[60vh] w-auto object-contain"
        />

        {image.description && (
          <p className="p-4 text-sm text-gray-700">
            {image.description}
          </p>
        )}
        <ReactionBar imageId={image.id} />
        <div className="border-t p-4">
          <h2 className="mb-3 text-lg font-semibold">
            Comments
          </h2>

          {isLoading && <p>Loading comments...</p>}

          {!isLoading && comments.length === 0 && (
            <p className="text-sm text-gray-500">
              No comments yet.
            </p>
          )}

          <div className="mb-4 space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded bg-gray-100 p-2"
              >
                {comment.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(event) =>
                setCommentText(event.target.value)
              }
              placeholder="Add a comment..."
              className="flex-1 rounded border px-3 py-2"
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded bg-black px-4 py-2 text-white"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;