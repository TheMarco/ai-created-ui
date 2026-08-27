import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-surface2 motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  );
});

export default Skeleton;
