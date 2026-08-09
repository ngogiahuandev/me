import { Skeleton } from "@repo/core/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Loading project</span>
      <article className="mx-auto flex w-full max-w-4xl flex-1 flex-col border-x" aria-hidden>
        <div className="border-b px-4 py-3 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-16" />
        </div>

        <header className="border-b px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-9 w-64 max-w-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="size-9 rounded-full" />
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-5 w-20 rounded-full" />
            ))}
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Skeleton className="aspect-video w-full" />
        </div>

        <div className="space-y-8 border-t px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {[0, 1].map((section) => (
            <section key={section}>
              <Skeleton className="h-6 w-44" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
