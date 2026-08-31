'use client';

import { accentNames, useTheme, type Accent } from '@ai-created/ui';

export default function AccentPicker() {
  const { accent, setAccent } = useTheme();

  return (
    <label className="relative">
      <span className="sr-only">Accent color</span>
      <select
        aria-label="Accent color"
        value={accent}
        onChange={(event) => setAccent(event.target.value as Accent)}
        className="h-11 rounded-md border border-control-border bg-surface px-3 text-xs capitalize text-text transition-colors hover:border-control-border-strong focus:border-accent"
      >
        {accentNames.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
    </label>
  );
}
