'use client';

import DSCopyButton from './DSCopyButton';

interface DSCodeBlockProps {
  code: string;
  language?: string;
  /** Accessible name for the scrollable code region. Defaults to the language. */
  label?: string;
}

export default function DSCodeBlock({ code, language, label }: DSCodeBlockProps) {
  const accessibleName = label ?? (language ? `${language} code sample` : 'Code sample');

  return (
    <div className="relative rounded-md border border-border bg-[#0A0A0B] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        {language && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            {language}
          </span>
        )}
        <DSCopyButton value={code} className="text-white/40 hover:text-white/70 ml-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider">Copy Code</span>
        </DSCopyButton>
      </div>
      <pre
        role="region"
        aria-label={accessibleName}
        tabIndex={0}
        className="p-4 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[-2px]"
      >
        <code className="text-sm font-mono text-[#F5F7FA] leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
