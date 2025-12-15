import { TrashIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { deletePost } from "@/actions/post-actions";
import { prisma } from "@/lib/prisma";

export async function PostTable({ className }: { className?: string }) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Posts
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[155px] !text-left">Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="!text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              className="text-center text-base font-medium text-dark dark:text-white"
            >
              <TableCell className="min-w-[155px] !text-left">
                <h5 className="text-dark dark:text-white">{post.title}</h5>
                <p className="mt-[3px] text-body-sm font-medium line-clamp-1">
                  {post.content}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {post.author.name || post.author.email}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {dayjs(post.createdAt).format("MMM DD, YYYY")}
                </p>
              </TableCell>

              <TableCell>
                <div
                  className={cn(
                    "mx-auto max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]": post.published,
                      "bg-[#D34053]/[0.08] text-[#D34053]": !post.published,
                    },
                  )}
                >
                  {post.published ? "Published" : "Draft"}
                </div>
              </TableCell>

              <TableCell className="!text-right">
                <div className="flex items-center justify-end gap-x-3.5">
                  <form action={deletePost.bind(null, post.id)}>
                    <button className="hover:text-primary">
                      <span className="sr-only">Delete Post</span>
                      <TrashIcon />
                    </button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
