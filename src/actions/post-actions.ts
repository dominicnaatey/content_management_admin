"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for post validation
const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  published: z.coerce.boolean(),
});

export async function createPost(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      error: "You must be signed in to create a post",
    };
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    published: formData.get("published"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { title, content, published } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return {
      error: "User not found",
    };
  }

  await prisma.post.create({
    data: {
      title,
      content,
      published,
      authorId: user.id,
    },
  });

  revalidatePath("/posts");
  redirect("/posts");
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to delete a post");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to update a post");
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    published: formData.get("published"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { title, content, published } = validatedFields.data;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      published,
    },
  });

  revalidatePath("/posts");
  redirect("/posts");
}
