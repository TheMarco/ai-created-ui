'use client';

import { useId, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';

export interface Tab<T extends string = string> {
  key: T;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string> {
  /** Stable group id used to connect tabs to panels. */
  id?: string;
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
  label: string;
  className?: string;
}

export default function Tabs<T extends string>({
  id: providedId,
  tabs,
  active,
  onChange,
  label,
  className,
}: TabsProps<T>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setTabRef = useCallback(
    (key: string) => (el: HTMLButtonElement | null) => {
      if (el) {
        tabRefs.current.set(key, el);
      } else {
        tabRefs.current.delete(key);
      }
    },
    []
  );

  function focusTab(key: string) {
    tabRefs.current.get(key)?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((t) => t.key === active);
    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    onChange(nextTab.key);
    focusTab(nextTab.key);
  }

  return (
    // The tab buttons, rather than the tablist container, own the roving focus target.
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      role="tablist"
      aria-label={label}
      className={cn('flex gap-0.5', className)}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            ref={setTabRef(tab.key)}
            id={`${id}-tab-${tab.key}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={providedId ? `${id}-panel-${tab.key}` : undefined}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative flex items-center gap-2 rounded-t-md px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
              isActive
                ? 'bg-highlight text-text'
                : 'text-text3 hover:text-text2'
            )}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Stable helper for connecting a panel to its tab. Pass the same `tabsId` to
 * both this hook and the parent `Tabs` component to emit valid relationships.
 */
export function useTabPanelProps<T extends string>(
  tabKey: T,
  activeKey: T,
  tabsId?: string
) {
  const generatedId = useId();
  const id = tabsId ?? generatedId;
  return {
    id: `${id}-panel-${tabKey}`,
    role: 'tabpanel' as const,
    'aria-labelledby': tabsId ? `${id}-tab-${tabKey}` : undefined,
    tabIndex: 0,
    hidden: activeKey !== tabKey,
  };
}
