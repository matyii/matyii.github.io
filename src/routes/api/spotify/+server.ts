import { json } from '@sveltejs/kit';

let userAccessToken: string | null = null; // Store the user's access token securely

export async function GET() {
    if (!userAccessToken) {
        return json({ error: 'User not authenticated' }, { status: 401 });
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            Authorization: `Bearer ${userAccessToken}`
        }
    });

    if (response.status === 204) {
        return json({ message: 'No track currently playing.' });
    }

    if (response.status === 401) {
        return json({ error: 'Access token expired' }, { status: 401 });
    }

    const data = await response.json();
    return json(data);
}