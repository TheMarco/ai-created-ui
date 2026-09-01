'use client';

import {
  Dropdown,
  accentNames,
  useTheme,
  type Accent,
  type DropdownOption,
} from '@ai-created/ui';

const accentOptions: DropdownOption<Accent>[] = accentNames.map((name) => ({
  value: name,
  label: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
}));

interface AccentPickerProps {
  compact?: boolean;
}

export default function AccentPicker({ compact = false }: AccentPickerProps) {
  const { accent, setAccent } = useTheme();

  return (
    <Dropdown
      options={accentOptions}
      value={accent}
      onChange={setAccent}
      label="Accent color"
      className={compact ? 'w-28 [&>label]:sr-only' : 'w-40'}
    />
  );
}
