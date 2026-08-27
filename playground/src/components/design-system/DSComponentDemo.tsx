'use client';

interface DSComponentDemoProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function DSComponentDemo({
  id,
  title,
  description,
  children,
  className = '',
}: DSComponentDemoProps) {
  const demoId = id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div
      id={`demo-${demoId}`}
      data-demo={demoId}
      className={`scroll-mt-28 rounded-lg border border-border overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-base font-heading font-medium text-text">{title}</h4>
        {description && (
          <p className="mt-1 text-text2 text-sm">{description}</p>
        )}
      </div>
      <div className="bg-surface2 p-8">
        {children}
      </div>
    </div>
  );
}
