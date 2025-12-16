"use client";

import { TrashIcon } from "@/assets/icons";
import { deletePost } from "@/actions/post-actions";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";

export function DeletePostButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-primary"
        type="button"
      >
        <span className="sr-only">Delete Post</span>
        <TrashIcon />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Post"
      >
        <div className="mb-6 text-dark dark:text-white">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded px-4 py-2 text-sm font-medium text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
