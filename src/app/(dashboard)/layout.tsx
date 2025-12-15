import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import type { PropsWithChildren } from "react";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header user={session?.user} />

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
