import { json } from '@sveltejs/kit';
import { env as publicEnv } from '$env/dynamic/public';

type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline' | 'unknown';

type PresencePayload = {
  available: boolean;
  status: DiscordStatus;
  activity: string | null;
  bannerUrl?: string | null;
  reason?: string;
  data?: LanyardData;
};

type LanyardActivity = {
  type?: number;
  name?: string;
  details?: string;
  state?: string;
};

type LanyardSpotify = {
  song?: string;
  artist?: string;
};

type LanyardData = {
  discord_status?: string;
  activities?: LanyardActivity[];
  spotify?: LanyardSpotify | null;
};

type LanyardResponse = {
  success?: boolean;
  data?: LanyardData;
  error?: {
    code?: string;
    message?: string;
  };
};

function normalizeStatus(status: string | undefined): DiscordStatus {
  if (status === 'online' || status === 'idle' || status === 'dnd' || status === 'offline') {
    return status;
  }

  return 'unknown';
}

function extractActivity(data: LanyardData | undefined): string | null {
  if (!data) return null;

  const customStatus = data.activities?.find((activity) => activity.type === 4 && activity.state);
  if (customStatus?.state) return customStatus.state;

  const richPresence = data.activities?.find((activity) => activity.type === 0 && activity.name);
  if (richPresence) {
    const parts = [richPresence.name, richPresence.details, richPresence.state].filter(Boolean);
    return parts.length > 0 ? parts.join(' - ') : null;
  }

  if (data.spotify?.song && data.spotify.artist) {
    return `Listening to ${data.spotify.artist} - ${data.spotify.song}`;
  }

  return null;
}

export async function GET() {
  const fallback: PresencePayload = {
    available: false,
    status: 'unknown',
    activity: null
  };

  try {
    const discordUserId = publicEnv.PUBLIC_DISCORD_USER_ID || process.env.PUBLIC_DISCORD_USER_ID;
    const discordBannerUrl =
      publicEnv.PUBLIC_DISCORD_BANNER_URL || process.env.PUBLIC_DISCORD_BANNER_URL || null;
    if (!discordUserId) {
      return json({ ...fallback, bannerUrl: discordBannerUrl }, {
        headers: { 'cache-control': 'public, max-age=60' }
      });
    }

    const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
    if (!response.ok) {
      return json({ ...fallback, bannerUrl: discordBannerUrl }, { headers: { 'cache-control': 'public, max-age=60' } });
    }

    const payload = (await response.json()) as LanyardResponse;
    if (!payload.success || !payload.data) {
      return json(
        {
          ...fallback,
          bannerUrl: discordBannerUrl,
          reason: payload.error?.code || payload.error?.message || 'presence_unavailable',
          data: payload.data
        },
        { headers: { 'cache-control': 'public, max-age=60' } }
      );
    }

    const normalized: PresencePayload = {
      available: true,
      status: normalizeStatus(payload.data.discord_status),
      activity: extractActivity(payload.data),
      bannerUrl: discordBannerUrl,
      data: payload.data
    };

    return json(normalized, {
      headers: { 'cache-control': 'public, max-age=30' }
    });
  } catch {
    const discordBannerUrl =
      publicEnv.PUBLIC_DISCORD_BANNER_URL || process.env.PUBLIC_DISCORD_BANNER_URL || null;
    return json({ ...fallback, bannerUrl: discordBannerUrl }, {
      headers: { 'cache-control': 'public, max-age=60' }
    });
  }
}
