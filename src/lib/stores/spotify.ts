
import { writable } from 'svelte/store';

const STALE_PAUSED_HIDE_AFTER_MS = 15 * 60 * 1000;

export interface NowPlaying {
    item?: {
        name: string;
        artists: { name: string, external_urls: { spotify: string } }[];
        album: { images: { url: string }[], name: string, external_urls: { spotify: string } };
        duration_ms: number;
        external_urls: { spotify: string };
    };
    is_playing?: boolean;
    is_stale?: boolean;
    timestamp?: number;
    progress_ms?: number;
    message?: string;
}

export interface Device {
    name: string;
    type: string;
    volume_percent: number;
    is_active: boolean;
}

function createSpotifyStore() {
    const nowPlaying = writable<NowPlaying | null>(null);
    const devices = writable<Device[] | null>(null);
    const activeDevice = writable<Device | null>(null);
    const progress = writable<number>(0);
    const progressMs = writable<number>(0);
    let progressInterval: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    function isStalePaused(nowPlayingData: NowPlaying | null): boolean {
        if (!nowPlayingData?.item) return false;
        if (nowPlayingData.is_playing) return false;

        if (!nowPlayingData.timestamp) return false;
        const pausedForMs = Date.now() - nowPlayingData.timestamp;
        return pausedForMs >= STALE_PAUSED_HIDE_AFTER_MS;
    }

    async function fetchNowPlaying() {
        try {
            const response = await fetch('/api/spotify');
            if (!response.ok) throw new Error('Failed to fetch Spotify data');
            const data = await response.json();

            const incomingNowPlaying: NowPlaying | null = data.nowPlaying ?? null;
            const stale = isStalePaused(incomingNowPlaying);
            const enrichedNowPlaying: NowPlaying | null = incomingNowPlaying?.item
                ? { ...incomingNowPlaying, is_stale: stale }
                : null;

            nowPlaying.set(enrichedNowPlaying);
            devices.set(data.devices.devices);
            activeDevice.set(data.devices.devices?.find((d: Device) => d.is_active) || null);

            if (enrichedNowPlaying?.progress_ms && enrichedNowPlaying?.item?.duration_ms) {
                progressMs.set(enrichedNowPlaying.progress_ms);
                progress.set((enrichedNowPlaying.progress_ms / enrichedNowPlaying.item.duration_ms) * 100);
            } else {
                progressMs.set(0);
                progress.set(0);
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        }
    }

function startProgressCounter(currentNowPlaying: NowPlaying | null) {
    if (progressInterval) clearInterval(progressInterval);
    if (currentNowPlaying?.progress_ms && currentNowPlaying?.item?.duration_ms) {
        let ms = currentNowPlaying.progress_ms;
        let isPlaying = currentNowPlaying.is_playing ?? false;
        progressInterval = setInterval(() => {
            isPlaying = currentNowPlaying.is_playing ?? false;
            if (isPlaying) {
                ms += 1000;
                if (currentNowPlaying.item && ms > currentNowPlaying.item.duration_ms) {
                    ms = currentNowPlaying.item.duration_ms;
                }
                if (currentNowPlaying.item) {
                    progress.set((ms / currentNowPlaying.item.duration_ms) * 100);
                }
                progressMs.set(ms);
            }
        }, 1000);
    }
}

    function start() {
        fetchNowPlaying().then(() => {
            let unsub = nowPlaying.subscribe(startProgressCounter);
            interval = setInterval(async () => {
                await fetchNowPlaying();
            }, 5000);
            return unsub;
        });
    }

    function stop() {
        if (interval) clearInterval(interval);
        if (progressInterval) clearInterval(progressInterval);
    }

    return {
        nowPlaying,
        devices,
        activeDevice,
        progress,
        progressMs,
        fetchNowPlaying,
        start,
        stop,
    };
}

export const spotify = createSpotifyStore();
