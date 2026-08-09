import { Footer } from "@repo/core/components/layouts/footer";
import { StripedSeparator } from "@repo/core/components/layouts/striped-separator";
import { Skeleton } from "@repo/core/components/skeleton";
import { Separator } from "@repo/core/components/separator";

const TWO_ROWS = [0, 1];
const THREE_ROWS = [0, 1, 2];

function SectionSkeleton({ rows = TWO_ROWS }: { rows?: number[] }) {
  return (
    <section aria-hidden="true">
      <div className="mx-auto w-full max-w-4xl border-x">
        <div className="border-b px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Skeleton className="h-7 w-36" />
        </div>
        <div className="divide-y">
          {rows.map((row) => (
            <div key={row} className="flex items-start gap-3 px-4 py-5 sm:px-6 lg:px-8">
              <Skeleton className="size-10 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-full max-w-xl" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Loading home page</span>

      <section className="border-b" aria-hidden="true">
        <div className="mx-auto w-full max-w-4xl border-x px-4 py-10 sm:px-6 sm:py-8 lg:px-8">
          <Skeleton className="h-9 w-72 max-w-full" />
        </div>
      </section>

      <section aria-hidden="true">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4 border-x px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="size-20 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>

      <StripedSeparator height="h-12" />
      <SectionSkeleton />
      <Separator />
      <SectionSkeleton rows={THREE_ROWS} />
      <StripedSeparator height="h-12" />

      <section aria-hidden="true">
        <div className="mx-auto w-full max-w-4xl border-x">
          <div className="border-b px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <Skeleton className="h-7 w-32" />
          </div>
          <div className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
            <Skeleton className="h-36 w-full" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-16" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <StripedSeparator height="h-12" />
      <SectionSkeleton rows={THREE_ROWS} />
      <StripedSeparator height="h-12" />
      <SectionSkeleton />
      <StripedSeparator height="h-12" />
      <SectionSkeleton rows={THREE_ROWS} />
      <StripedSeparator height="h-12" />
      <SectionSkeleton />
      <StripedSeparator height="h-12" />
      <SectionSkeleton />
      <StripedSeparator height="h-12" />
      <SectionSkeleton rows={THREE_ROWS} />
      <Footer />
    </div>
  );
}
