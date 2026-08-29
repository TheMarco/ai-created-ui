'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

interface DSCopyButtonProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DSCopyButton({ value, className = '', children }: DSCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimeout.current), []);

  const showCopiedState = useCallback(() => {
    clearTimeout(resetTimeout.current);
    setCopied(true);
    resetTimeout.current = setTimeout(() => setCopied(false), 1500);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      showCopiedState();
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopiedState();
    }
  }, [showCopiedState, value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group inline-flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${className}`}
      aria-label={copied ? 'Code copied' : 'Copy code'}
      title={copied ? 'Code copied' : 'Copy code'}
    >
      {children}
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 text-text3 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
    </button>
  );
}
