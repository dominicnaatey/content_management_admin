"use client";

import { updatePost } from "@/actions/post-actions";
import Editor from "@/components/Editor";
import { Checkbox } from "@/components/FormElements/checkbox";
import InputGroup from "@/components/FormElements/InputGroup";
import { Post } from "@/generated/client/client";
import Image from "next/image";
import { useActionState, useState } from "react";

interface EditPostFormProps {
  post: Post;
}

export function EditPostForm({ post }: EditPostFormProps) {
  const updatePostWithId = updatePost.bind(null, post.id);
  const [state, action, isPending] = useActionState(updatePostWithId, undefined);
  const [preview, setPreview] = useState<string | null>(post.image);
  const [content, setContent] = useState(post.content || "");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(post.image);
    }
  };

  return (
    <form action={action}>
      <InputGroup
        label="Title"
        name="title"
        type="text"
        placeholder="Enter post title"
        defaultValue={post.title}
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
          defaultChecked={post.published}
        />
      </div>

      {state?.error && (
        <div className="mb-4 text-sm text-red-500">{state.error}</div>
      )}

      <button
        disabled={isPending}
        className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-70"
      >
        {isPending ? "Updating..." : "Update Post"}
      </button>
    </form>
  );
}
