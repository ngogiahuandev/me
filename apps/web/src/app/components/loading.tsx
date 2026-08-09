import { PageHeaderSkeleton } from "@repo/core/components/layouts/page-header-skeleton";
import { Skeleton } from "@repo/core/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Loading components</span>
      <PageHeaderSkeleton />
      <article className="mx-auto flex w-full max-w-4xl flex-1 flex-col border-x" aria-hidden>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <div className="flex h-14 items-center gap-3 border-b px-4 sm:border-r">
            <Skeleton className="size-5 shrink-0" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </article>
    </div>
  );
}
