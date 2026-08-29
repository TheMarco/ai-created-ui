'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';

export interface ComponentDirectoryItem {
  id: string;
  name: string;
  category: string;
  purpose: string;
  states: string[];
}

function normalize(value: string) {
  return value.toLocaleLowerCase().trim();
}

export default function ComponentDirectory({ items }: { items: ComponentDirectoryItem[] }) {
  const directoryRef = useRef<HTMLDivElement>(null);
  const previousHasQuery = useRef(false);
  const [query, setQuery] = useState('');
  const hasQuery = query.trim().length > 0;
  useEffect(() => {
    const directory = directoryRef.current;
    if (!directory) return;
    directory.dataset.hydrated = 'true';
    return () => {
      delete directory.dataset.hydrated;
    };
  }, []);

  useEffect(() => {
    const wasSearching = previousHasQuery.current;
    previousHasQuery.current = hasQuery;
    if (!hasQuery || wasSearching) return undefined;

    const frame = window.requestAnimationFrame(() => {
      directoryRef.current?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hasQuery]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return items;
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return items.filter((item) => {
      const searchableText = normalize([item.name, item.category, item.purpose, ...item.states].join(' '));
      return terms.every((term) => searchableText.includes(term));
    });
  }, [items, query]);

  const groups = useMemo(() => {
    return filteredItems.reduce<Record<string, ComponentDirectoryItem[]>>((accumulator, item) => {
      (accumulator[item.category] ??= []).push(item);
      return accumulator;
    }, {});
  }, [filteredItems]);

  return (
    <div ref={directoryRef} data-visual="component-directory" className="scroll-mt-24">
      <div className="relative max-w-2xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text3"
          aria-hidden="true"
        />
        <label htmlFor="component-search" className="sr-only">
          Search components
        </label>
        <input
          id="component-search"
          type="text"
          role="searchbox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setQuery('');
          }}
          placeholder="Search by component, behavior, or state"
          className="w-full rounded-md border border-border bg-surface py-3 pl-11 pr-24 text-sm text-text placeholder:text-text3 transition-colors hover:border-border-strong focus:border-red-border"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 inline-flex min-h-9 -translate-y-1/2 items-center gap-1.5 rounded-sm px-2.5 text-xs text-text3 transition-colors hover:bg-surface2 hover:text-text"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        ) : null}
        <p role="status" className="mt-3 font-mono text-[11px] text-text3">
          {hasQuery
            ? `${filteredItems.length} of ${items.length} ${filteredItems.length === 1 ? 'match' : 'matches'}`
            : `${filteredItems.length} ${filteredItems.length === 1 ? 'entry' : 'entries'}`}
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-6 rounded-md border border-border bg-surface p-8">
          <h2 className="font-heading text-xl text-text">No matching components</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text2">
            Try a component name such as Button, a behavior such as focus, or a state such as disabled.
          </p>
        </div>
      ) : hasQuery ? (
        <section className="mt-6" aria-labelledby="search-results-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
            <h2 id="search-results-heading" className="font-heading text-xl font-medium text-text">
              Search results
            </h2>
            <p className="text-xs text-text3">Select a result to open its full specification.</p>
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/components/${item.id}`}
                  className="group flex min-h-32 items-start justify-between gap-6 rounded-md border border-border bg-surface p-5 transition-colors hover:border-border-strong focus-visible:border-border-strong"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-red">{item.category}</p>
                    <h3 className="mt-2 font-heading text-lg font-medium text-text">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text2">{item.purpose}</p>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-text3 transition-transform group-hover:translate-x-1 group-hover:text-text"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="mt-16 space-y-16">
          {Object.entries(groups).map(([category, categoryItems], groupIndex) => (
            <section
              key={category}
              aria-labelledby={`directory-${groupIndex}`}
              data-visual={groupIndex === 0 ? 'component-directory-primary-group' : undefined}
              className="scroll-mt-24"
            >
              <div className="max-w-2xl">
                <h2 id={`directory-${groupIndex}`} className="font-heading text-2xl font-medium text-text">
                  {category}
                </h2>
                <p className="mt-2 text-sm text-text2">
                  {categoryItems.length} documented {categoryItems.length === 1 ? 'contract' : 'contracts'}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {categoryItems.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/components/${item.id}`}
                    className={`group rounded-md border border-border bg-surface p-6 transition-colors hover:border-border-strong focus-visible:border-border-strong ${
                      index === 0 && categoryItems.length % 2 === 1 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg font-medium text-text">{item.name}</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text2">{item.purpose}</p>
                      </div>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-text3 transition-transform group-hover:translate-x-1 group-hover:text-text"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2" aria-label="Documented states">
                      {item.states.slice(0, 4).map((state) => (
                        <span
                          key={state}
                          className="rounded-sm border border-border bg-surface2 px-2 py-1 font-mono text-[10px] text-text2"
                        >
                          {state}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
