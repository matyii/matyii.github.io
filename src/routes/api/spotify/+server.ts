import { json } from '@sveltejs/kit';
import { getSpotifyNowPlayingAndDevices } from '$lib/utils/spotify';

export async function GET() {
    try {
        const data = await getSpotifyNowPlayingAndDevices();
        return json({
            nowPlaying: data.nowPlaying,
            devices: data.devices
        });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
