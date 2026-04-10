import { cn } from '../lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-surface2 motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  );
}
