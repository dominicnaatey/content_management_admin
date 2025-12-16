import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PostTable } from "@/components/Tables/post-table";
import { buttonVariants } from "@/components/ui-elements/button";
import Link from "next/link";

export default function PostsPage() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb pageName="Posts" />

        <Link
          href="/posts/create"
          className={buttonVariants({ shape: "full" })}
        >
          Create Post
        </Link>
      </div>

      <PostTable />
    </>
  );
}
