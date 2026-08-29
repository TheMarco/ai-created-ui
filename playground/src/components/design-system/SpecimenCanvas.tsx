'use client';

import { useEffect, useRef, useState } from 'react';
import { Expand, Monitor, Smartphone } from 'lucide-react';
import { cn } from '@ai-created/ui';

const widths = [
  { id: 'compact', label: 'Compact', width: 360, icon: Smartphone },
  { id: 'content', label: 'Content', width: 680, icon: Monitor },
  { id: 'full', label: 'Full', width: undefined, icon: Expand },
] as const;

type CanvasWidth = (typeof widths)[number]['id'];

export default function SpecimenCanvas({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<CanvasWidth>('full');
  const [quietBackground, setQuietBackground] = useState(true);
  const activeWidth = widths.find((option) => option.id === canvasWidth)?.width;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.dataset.hydrated = 'true';
    return () => {
      delete canvas.dataset.hydrated;
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      data-visual="specimen-canvas"
      className="overflow-hidden rounded-md border border-border bg-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Specimen canvas width">
          {widths.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCanvasWidth(id)}
              aria-pressed={canvasWidth === id}
              className={cn(
                'inline-flex min-h-9 items-center gap-2 rounded-sm px-3 text-xs transition-colors',
                canvasWidth === id
                  ? 'bg-red-solid text-white'
                  : 'text-text2 hover:bg-surface2 hover:text-text'
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setQuietBackground((value) => !value)}
          aria-pressed={quietBackground}
          className="min-h-9 rounded-sm px-3 text-xs text-text2 transition-colors hover:bg-surface2 hover:text-text"
        >
          Quiet background
        </button>
      </div>

      <div
        className={cn(
          'overflow-x-auto p-4 transition-colors sm:p-8',
          quietBackground ? 'bg-surface2' : 'bg-bg'
        )}
      >
        <div
          className="mx-auto min-h-64 rounded-md border border-border bg-surface p-5 sm:p-8"
          style={{ maxWidth: activeWidth ? `${activeWidth}px` : undefined }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
