export const motionDuration = {
  instant: 0.15,
  fast: 0.2,
  base: 0.3,
  reveal: 0.5,
  section: 0.6,
  ambient: 1.5,
} as const;

export const motionOffset = {
  sm: 16,
  md: 20,
  lg: 30,
  hover: 2,
  hoverStrong: 4,
} as const;

export const motionEase = {
  standard: [0.25, 0.25, 0.25, 0.75] as [number, number, number, number],
  inOut: 'easeInOut' as const,
  out: 'easeOut' as const,
} as const;

export function staggerDelay(index: number, step: number = 0.1, base: number = 0) {
  return base + index * step;
}

export function fadeUpMotion(
  delay: number = 0,
  y: number = motionOffset.md,
  duration: number = motionDuration.reveal
) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay },
  };
}

export function inViewFadeUpMotion(
  delay: number = 0,
  y: number = motionOffset.md,
  duration: number = motionDuration.reveal
) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration, delay },
  };
}

export function subtleHoverMotion(distance: number = motionOffset.hover) {
  return {
    whileHover: {
      y: -distance,
      transition: { duration: motionDuration.fast },
    },
  };
}

export function borderHoverMotion(
  distance: number = motionOffset.hoverStrong,
  borderColor = 'var(--color-border-strong)'
) {
  return {
    whileHover: {
      y: -distance,
      borderColor,
      transition: { duration: motionDuration.fast },
    },
  };
}
