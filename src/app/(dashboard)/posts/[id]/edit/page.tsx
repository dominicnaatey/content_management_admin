import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { notFound } from "next/navigation";
import { EditPostForm } from "./_components/edit-post-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Post | Next.js E-commerce Dashboard Template",
  description: "This is Next.js Edit Post page for TailAdmin Dashboard Template",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Edit Post" />

      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
          <h3 className="font-semibold text-dark dark:text-white">
            Edit Post
          </h3>
        </div>
        <div className="p-6.5">
          <EditPostForm post={post} />
        </div>
      </div>
    </div>
  );
}
