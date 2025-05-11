import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function refreshAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN
        })
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(`Failed to refresh access token: ${data.error}`);
    }

    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
}

async function ensureAccessToken() {
    if (!accessToken || (tokenExpiry && Date.now() >= tokenExpiry)) {
        await refreshAccessToken();
    }
}

export async function GET() {
    try {
        await ensureAccessToken();

        const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        let nowPlaying = null;
        if (nowPlayingResponse.status === 204) {
            nowPlaying = { message: 'No track currently playing.' };
        } else if (nowPlayingResponse.ok) {
            nowPlaying = await nowPlayingResponse.json();
        } else {
            const error = await nowPlayingResponse.json();
            return json({ error }, { status: nowPlayingResponse.status });
        }

        const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        let devices = null;
        if (devicesResponse.ok) {
            devices = await devicesResponse.json();
        } else {
            const error = await devicesResponse.json();
            return json({ error }, { status: devicesResponse.status });
        }

        return json({ nowPlaying, devices });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}
