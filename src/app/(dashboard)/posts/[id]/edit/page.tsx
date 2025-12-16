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
      <EditPostForm post={post} />
    </div>
  );
}
