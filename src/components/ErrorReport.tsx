'use client';

import { useId, useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import Notice from './Notice';
import Button from './Button';

export interface ErrorReportProps {
  title?: string;
  message: string;
  details?: string | null;
  timestamp?: string;
}

export default function ErrorReport({
  title = 'Something went wrong',
  message,
  details,
  timestamp,
}: ErrorReportProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const detailsId = useId();

  const safeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'unknown';

  const debugInfo = [
    `Error: ${message}`,
    details ? `Details: ${details}` : null,
    timestamp ? `Time: ${timestamp}` : `Time: ${new Date().toISOString()}`,
    `URL: ${safeUrl}`,
  ].filter(Boolean).join('\n');

  async function handleCopy() {
    await navigator.clipboard.writeText(debugInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Notice variant="error" title={title}>
      <div className="space-y-2">
        <p>{message}</p>
        {details && (
          <div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls={detailsId}
              className="flex items-center gap-1 text-xs text-text3 hover:text-text2 transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              )}
              Debug info
            </button>
            {expanded && (
              <div id={detailsId} className="mt-2 space-y-2">
                <pre className="rounded bg-surface2 p-3 text-xs text-text3 overflow-x-auto whitespace-pre-wrap">
                  {debugInfo}
                </pre>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <><Check className="h-3 w-3" aria-hidden="true" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" aria-hidden="true" /> Copy debug info</>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Notice>
  );
}
