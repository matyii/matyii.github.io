import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'https://stage.itsmatyii.fun/api/spotify/callback'; // Replace with your redirect URI

export async function GET({ url }) {
    const code = url.searchParams.get('code');

    if (!code) {
        return json({ error: 'Authorization code missing' }, { status: 400 });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        })
    });

    const data = await response.json();

    if (data.error) {
        return json({ error: data.error }, { status: 400 });
    }

    // Return the access token to the frontend (or store it securely)
    return json(data);
}