import { browser } from "$app/environment";
import { readable } from "svelte/store";

export type MotionPreference = "full" | "reduced";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function detectMotionPreference(): MotionPreference {
  if (!browser) return "full";
  return window.matchMedia(MOTION_QUERY).matches ? "reduced" : "full";
}

export const motionPreference = readable<MotionPreference>("full", (set) => {
  if (!browser) return;

  const mediaQuery = window.matchMedia(MOTION_QUERY);
  const updatePreference = () => set(detectMotionPreference());

  updatePreference();
  mediaQuery.addEventListener("change", updatePreference);

  return () => {
    mediaQuery.removeEventListener("change", updatePreference);
  };
});
