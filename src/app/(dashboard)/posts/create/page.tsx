import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { CreatePostForm } from "./_components/create-post-form";

export default function CreatePostPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Create Post" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Post Details" className="!p-6.5">
            <CreatePostForm />
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
}
