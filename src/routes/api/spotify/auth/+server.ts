import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:5173/api/spotify/callback'; // Replace with your redirect URI
const SCOPES = 'user-read-currently-playing';

export async function GET() {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
        SCOPES
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    throw redirect(302, authUrl);
}