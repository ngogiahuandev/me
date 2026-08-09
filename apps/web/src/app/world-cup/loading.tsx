import { PageHeaderSkeleton } from "@repo/core/components/layouts/page-header-skeleton";
import { StripedSeparator } from "@repo/core/components/layouts/striped-separator";
import { Skeleton } from "@repo/core/components/skeleton";

const MATCH_ROWS = [0, 1, 2, 3, 4, 5];
const GROUPS = [0, 1, 2, 3, 4, 5];

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Loading World Cup schedule</span>
      <PageHeaderSkeleton />

      <section aria-hidden>
        <div className="mx-auto w-full max-w-4xl space-y-2 border-x px-4 py-5 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-3 w-56" />
        </div>
      </section>

      <StripedSeparator height="h-12" />
      <section aria-hidden>
        <div className="mx-auto w-full max-w-[1600px] border-x">
          <div className="border-b px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <Skeleton className="h-7 w-32" />
          </div>
          <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {MATCH_ROWS.map((row) => (
              <div key={row} className="space-y-3 p-4 sm:p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <StripedSeparator height="h-12" />
      <section aria-hidden>
        <div className="mx-auto w-full max-w-[1600px] border-x">
          <div className="border-b px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <Skeleton className="h-7 w-28" />
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 xl:grid-cols-3">
            {GROUPS.map((group) => (
              <Skeleton key={group} className="h-52 rounded-none" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
