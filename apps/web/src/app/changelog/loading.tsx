import { PageHeaderSkeleton } from "@repo/core/components/layouts/page-header-skeleton";
import { Skeleton } from "@repo/core/components/skeleton";

const ENTRIES = [0, 1, 2, 3];
const CHANGES = [0, 1, 2];

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Loading changelog</span>
      <PageHeaderSkeleton />
      <article className="mx-auto flex w-full max-w-4xl flex-1 flex-col border-x" aria-hidden>
        <ol className="divide-y">
          {ENTRIES.map((entry) => (
            <li key={entry} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <Skeleton className="h-3 w-32" />
              <div className="mt-4 space-y-4">
                {CHANGES.map((change) => (
                  <div key={change} className="flex items-center gap-3">
                    <Skeleton className="size-5 shrink-0 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
