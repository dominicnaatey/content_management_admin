import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PostTable } from "@/components/Tables/post-table";
import Link from "next/link";

export default function PostsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb pageName="Posts" />
        
        <Link
          href="/posts/create"
          className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Create Post
        </Link>
      </div>

      <PostTable />
    </div>
  );
}
