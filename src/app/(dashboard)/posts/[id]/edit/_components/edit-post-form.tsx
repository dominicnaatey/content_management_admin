"use client";

import { updatePost } from "@/actions/post-actions";
import Editor from "@/components/Editor";
import { Checkbox } from "@/components/FormElements/checkbox";
import InputGroup from "@/components/FormElements/InputGroup";
import { Alert } from "@/components/ui-elements/alert";
import { Post } from "@/generated/client/client";
import Image from "next/image";
import { useActionState, useState, useEffect } from "react";

interface EditPostFormProps {
  post: Post;
}

export function EditPostForm({ post }: EditPostFormProps) {
  const updatePostWithId = updatePost.bind(null, post.id);
  const [state, action, isPending] = useActionState(updatePostWithId, undefined);
  const [preview, setPreview] = useState<string | null>(post.image);
  const [content, setContent] = useState(post.content || "");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [title, setTitle] = useState(post.title || "");
  const [published, setPublished] = useState(post.published || false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    if (state && "success" in state && state.success) {
      setShowSuccessAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    const isTitleChanged = title !== post.title;
    const isContentChanged = content !== (post.content || "");
    const isPublishedChanged = published !== (post.published || false);
    const isImageChanged = newImage !== null;

    setHasChanges(
      isTitleChanged || isContentChanged || isPublishedChanged || isImageChanged
    );
  }, [title, content, published, newImage, post]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setNewImage(file);
    } else {
      setPreview(post.image);
      setNewImage(null);
    }
  };

  return (
    <>
      {showSuccessAlert && (
        <div className="mb-4">
          <Alert
            variant="success"
            title="Success"
            description={state?.message || "Post updated successfully"}
          />
        </div>
      )}

      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
          <h3 className="font-semibold text-dark dark:text-white">Edit Post</h3>
        </div>
        <div className="p-6.5">
          <form action={action}>
            <InputGroup
              label="Title"
              name="title"
              type="text"
              placeholder="Enter post title"
              defaultValue={post.title}
              value={title}
              handleChange={(e) => setTitle(e.target.value)}
              className="mb-4.5"
              required
            />

            <div className="mb-6">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                Content
              </label>
              <Editor value={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                Featured Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
              {preview && (
                <div className="mt-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <Checkbox
                label="Publish immediately"
                name="published"
                withBg
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
            </div>

            {state?.error && (
              <div className="mb-4 text-sm text-red-500">{state.error}</div>
            )}

            <button
              disabled={isPending || !hasChanges}
              className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
