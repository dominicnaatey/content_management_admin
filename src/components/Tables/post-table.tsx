import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { DeletePostButton } from "./delete-post-button";

export async function PostTable({ className }: { className?: string }) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div
      className={cn(
        "rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5",
        className,
      )}
    >
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead className="w-[50px] !text-left">#</TableHead>
              <TableHead className="min-w-[155px] !text-left">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="!text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {posts.map((post, index) => (
              <TableRow
                key={post.id}
                className="text-center text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="!text-left text-dark dark:text-white">
                  {index + 1}
                </TableCell>
                <TableCell className="min-w-[155px] !text-left">
                  <div className="flex items-center gap-3">
                    {post.image && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="hover:text-primary"
                    >
                      <h5 className="text-dark dark:text-white hover:text-primary transition-colors">
                        {post.title}
                      </h5>
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{post.author.name || "Unknown"}</TableCell>

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
                    <DeletePostButton id={post.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
