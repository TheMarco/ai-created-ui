import DSCodeBlock from './DSCodeBlock';
import type { ComponentDocEntry } from './componentDocs';

function GuidanceList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-text2">
          <span className="mt-0.5 text-red" aria-hidden="true">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DSComponentReference({ entry }: { entry: ComponentDocEntry }) {
  return (
    <article
      id={`component-${entry.id}`}
      data-component-doc={entry.id}
      className="scroll-mt-28 overflow-hidden rounded-lg border border-border bg-surface"
    >
      <div className="border-b border-border px-5 py-5 md:px-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text3">
          {entry.category}
        </span>
        <h3 className="mt-2 font-heading text-xl font-medium text-text">{entry.name}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text2">{entry.purpose}</p>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2">
        <div className="bg-surface px-5 py-5 md:px-6">
          <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">
            Use when
          </h4>
          <GuidanceList items={entry.useWhen} />
        </div>
        <div className="bg-surface px-5 py-5 md:px-6">
          <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">
            Avoid when
          </h4>
          <GuidanceList items={entry.avoidWhen} />
        </div>
      </div>

      <details className="group border-t border-border">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-text transition-colors hover:bg-surface2 md:px-6">
          Full API contract
          <span className="font-mono text-text3 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>

        <div className="space-y-8 border-t border-border px-5 py-6 md:px-6">
          <div>
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">API</h4>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="min-w-[720px] w-full border-collapse text-left text-xs">
                <thead className="bg-surface2 font-mono uppercase tracking-wider text-text3">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-medium">Prop</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Type</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Default</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.api.map((row) => (
                    <tr key={row.prop} className="border-t border-border align-top">
                      <td className="px-3 py-2.5 font-mono text-text">{row.prop}</td>
                      <td className="px-3 py-2.5 font-mono text-text2">{row.type}</td>
                      <td className="px-3 py-2.5 font-mono text-text3">{row.defaultValue}</td>
                      <td className="px-3 py-2.5 leading-relaxed text-text2">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">States</h4>
              <GuidanceList items={entry.states} />
            </div>
            <div>
              <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">Accessibility</h4>
              <GuidanceList items={entry.accessibility} />
            </div>
            <div>
              <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">Composition</h4>
              <GuidanceList items={entry.composition} />
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">Example</h4>
            <DSCodeBlock code={entry.code} language="tsx" />
          </div>
        </div>
      </details>
    </article>
  );
}
