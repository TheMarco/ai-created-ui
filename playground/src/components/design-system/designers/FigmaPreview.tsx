'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Surface, Tabs, useTabPanelProps } from '@ai-created/ui';
import { figmaLibrary } from '@/lib/figma-library';

type PreviewTheme = 'dark' | 'light';
const tabs = [{ key: 'dark' as const, label: 'Dark' }, { key: 'light' as const, label: 'Light' }];
const tabsId = 'figma-theme-preview';

export default function FigmaPreview() {
  const [active, setActive] = useState<PreviewTheme>('dark');
  const darkPanel = useTabPanelProps('dark', active, tabsId);
  const lightPanel = useTabPanelProps('light', active, tabsId);

  return (
    <figure aria-labelledby="figma-preview-caption" data-visual="figma-preview">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border">
        <p className="pb-3 font-mono text-xs text-text2">Inside the kit / Dashboard</p>
        <Tabs id={tabsId} tabs={tabs} active={active} onChange={setActive} label="Figma preview theme" />
      </div>
      <Surface className="mt-5 overflow-hidden" padding="none">
        <div {...darkPanel}>
          <Image
            src={figmaLibrary.previews.dark}
            alt="Dark Figma dashboard template with a create action, four metrics, and a recent activity list."
            width={figmaLibrary.previews.width}
            height={figmaLibrary.previews.height}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="h-auto w-full"
          />
        </div>
        <div {...lightPanel}>
          <Image
            src={figmaLibrary.previews.light}
            alt="Light Figma dashboard template with the same layout, content, and red accent as the dark version."
            width={figmaLibrary.previews.width}
            height={figmaLibrary.previews.height}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="h-auto w-full"
          />
        </div>
      </Surface>
      <figcaption id="figma-preview-caption" className="mt-4 max-w-3xl text-xs leading-relaxed text-text2">
        Actual exports from the Figma file, shown with the red accent. Both themes use the same connected
        components. The kit includes {figmaLibrary.accents} accent choices; this preview changes appearance only.
      </figcaption>
    </figure>
  );
}
