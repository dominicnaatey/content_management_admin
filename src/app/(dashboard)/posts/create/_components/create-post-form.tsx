"use client";

import { createPost } from "@/actions/post-actions";
import { Checkbox } from "@/components/FormElements/checkbox";
import InputGroup from "@/components/FormElements/InputGroup";
import { useActionState } from "react";

export function CreatePostForm() {
  const [state, action, isPending] = useActionState(createPost, undefined);

  return (
    <form action={action}>
      <InputGroup
        label="Title"
        name="title"
        type="text"
        placeholder="Enter post title"
        className="mb-4.5"
        required
      />

      <div className="mb-6">
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Content
        </label>
        <textarea
          rows={6}
          name="content"
          placeholder="Enter post content"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      <div className="mb-6">
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Cover Image
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
        />
      </div>

      <div className="mb-6">
        <Checkbox label="Publish immediately" name="published" withBg />
      </div>

      {state?.error && (
        <div className="mb-4 text-sm text-red-500">{state.error}</div>
      )}

      <button
        disabled={isPending}
        className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-70"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
