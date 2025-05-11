import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiry: number | null = null;

// Function to refresh the access token
async function refreshAccessToken() {
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(`Failed to refresh access token: ${data.error}`);
    }

    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000; // Calculate expiry time
}

// Function to ensure the access token is valid
async function ensureAccessToken() {
    if (!accessToken || (tokenExpiry && Date.now() >= tokenExpiry)) {
        await refreshAccessToken();
    }
}

// Handle the API request
export async function GET() {
    try {
        await ensureAccessToken();

        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 204) {
            return json({ message: 'No track currently playing.' });
        }

        if (!response.ok) {
            const error = await response.json();
            return json({ error }, { status: response.status });
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}