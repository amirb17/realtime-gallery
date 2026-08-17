import { X } from "lucide-react";
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
    deleteComment,
    userId,
  } = useComments(image.id);

  const handleSubmit = async () => {
    await addComment();
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
  className="image-viewer-scroll relative max-h-[90vh] max-w-5xl overflow-y-auto overflow-x-hidden rounded-2xl bg-white"
  onClick={(event) => event.stopPropagation()}
>
      
        {/* Fixed close button */}
        <button
          type="button"
          onClick={onClose}
className="absolute right-4 top-4 cursor-pointer rounded-full bg-black px-3 py-1 text-xl text-white"          aria-label="Close image viewer"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Scrollable content */}
        <div className="image-viewer-scroll max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center">
  <img
    src={image.imageUrl}
    alt={image.description ?? "Gallery image"}
    className="block max-h-[80vh] w-full object-contain"
  />
</div>

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
                  className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                >
                  <span>{comment.text}</span>

                  {comment.userId === userId && (
                    <button
                      type="button"
                      onClick={() => deleteComment(comment.id)}
className="ml-3 cursor-pointer text-sm text-red-600 hover:underline"                    >
                      Delete
                    </button>
                  )}
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
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;