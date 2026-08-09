import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import { StripedPattern } from "../striped-pattern";

type PageHeaderSkeletonProps = {
  description?: boolean;
  maxWidthClassName?: string;
};

export function PageHeaderSkeleton({
  description = false,
  maxWidthClassName = "max-w-4xl",
}: PageHeaderSkeletonProps) {
  return (
    <div aria-hidden="true">
      <div className="relative w-full border-b">
        <div
          className={cn(
            "bg-background relative mx-auto flex w-full items-center border-x px-4 py-3 sm:px-6 lg:px-8",
            maxWidthClassName,
          )}
        >
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      <div className="relative w-full border-b">
        <StripedPattern className="-z-10" />
        <div
          className={cn(
            "bg-background relative mx-auto flex w-full items-center justify-between gap-4 border-x px-4 py-6 sm:px-6 sm:py-4 lg:px-8",
            maxWidthClassName,
          )}
        >
          <Skeleton className="h-7 w-40" />
          {description && <Skeleton className="h-4 w-48 max-w-[45%]" />}
        </div>
      </div>
    </div>
  );
}
