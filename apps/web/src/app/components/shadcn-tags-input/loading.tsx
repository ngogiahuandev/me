import { PageHeaderSkeleton } from "@repo/core/components/layouts/page-header-skeleton";
import { Skeleton } from "@repo/core/components/skeleton";
import { Separator } from "@repo/core/components/separator";

const SECTIONS = ["demo", "install", "usage", "hook", "constraints", "zod", "props", "types"];

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Loading Tags Input documentation</span>
      <PageHeaderSkeleton description />
      <article className="mx-auto flex w-full max-w-4xl flex-1 flex-col border-x" aria-hidden>
        {SECTIONS.map((section, index) => (
          <div key={section}>
            {index > 0 && <Separator />}
            <section className="px-4 py-8 sm:px-6 lg:px-8">
              <Skeleton className="h-6 w-36" />
              {index !== 0 && <Skeleton className="mt-2 h-4 w-full max-w-md" />}
              {index === 0 || index === 4 || index === 5 ? (
                <div className="mt-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="mt-2 h-72 w-full" />
                </div>
              ) : (
                <Skeleton className={index === 6 ? "mt-4 h-64 w-full" : "mt-4 h-36 w-full"} />
              )}
            </section>
          </div>
        ))}
      </article>
    </div>
  );
}
