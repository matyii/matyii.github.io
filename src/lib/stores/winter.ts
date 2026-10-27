import { browser } from "$app/environment";
import { derived, writable } from "svelte/store";

export type WinterOverride = "auto" | "on" | "off";

const STORAGE_KEY = "winter-mode-override";

function isWinterPeriod(date: Date = new Date()): boolean {
	const month = date.getMonth(); // 0-11
	const day = date.getDate();
	
	// December 1st onwards (month 11)
	if (month === 11) {
		return day >= 1;
	}
	
	// January 1st through January 10th (month 0)
	if (month === 0) {
		return day <= 10;
	}
	
	return false;
}

function getStoredOverride(): WinterOverride {
	if (!browser) return "auto";
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "on" || stored === "off" || stored === "auto") {
			return stored;
		}
	} catch {
		// ignore
	}
	return "auto";
}

function setStoredOverride(value: WinterOverride): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// ignore
	}
}

const overrideStore = writable<WinterOverride>(getStoredOverride());

export const winterOverride = {
	subscribe: overrideStore.subscribe,
	set: (value: WinterOverride) => {
		setStoredOverride(value);
		overrideStore.set(value);
	},
	update: (fn: (value: WinterOverride) => WinterOverride) => {
		overrideStore.update((current) => {
			const next = fn(current);
			setStoredOverride(next);
			return next;
		});
	}
};

export const winterEnabled = derived(overrideStore, ($override) => {
	if ($override === "on") return true;
	if ($override === "off") return false;
	// auto mode
	return isWinterPeriod();
});

export function cycleWinterOverride(): void {
	winterOverride.update((current) => {
		if (current === "auto") {
			// If in winter period and auto, turn off; else turn on
			return isWinterPeriod() ? "off" : "on";
		}
		if (current === "on") return "auto";
		if (current === "off") return "on";
		return "auto";
	});
}
