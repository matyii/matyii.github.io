export const MOTION = {
  duration: {
    instant: 0,
    fast: 160,
    base: 240,
    medium: 360,
    slow: 520
  },
  stagger: {
    tight: 40,
    base: 70
  },
  distance: {
    subtleY: 10,
    sectionY: 14,
    cardY: 8
  },
  scale: {
    hoverCard: 1.03,
    hoverMedia: 1.04
  }
} as const;

export const PARALLAX = {
  maxOffsetX: 92,
  maxOffsetY: 58,
  smoothing: 0.08
} as const;

export function motionDuration(ms: number, reducedMotion: boolean): number {
  return reducedMotion ? MOTION.duration.instant : ms;
}

export function motionOffset(px: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : px;
}

export function motionDelay(index: number, baseDelay: number = MOTION.stagger.base, reducedMotion = false): number {
  if (reducedMotion) return 0;
  return Math.max(0, index) * baseDelay;
}
