<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import Navbar from "$lib/components/custom/Navbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { onMount, onDestroy } from 'svelte';

    import { pageTitle } from "$lib/stores/title";
    pageTitle.set("")
    import { LaptopIcon, SmartphoneIcon, SpeakerIcon, Gamepad2Icon, Github, Mail, Music } from "@lucide/svelte";

    interface NowPlaying {
        item?: {
            name: string;
            artists: { name: string, external_urls: { spotify: string } }[];
            album: { images: { url: string }[], name: string, external_urls: { spotify: string } };
            duration_ms: number;
            external_urls: { spotify: string };
        };
        progress_ms?: number;
        message?: string;
    }

    interface Device {
        name: string;
        type: string;
        volume_percent: number;
        is_active: boolean;
    }

    let nowPlaying: NowPlaying | null = null;
    let devices: Device[] | null = null;
    let activeDevice: Device | null = null;
    let progress = 0; // Progress percentage
    let interval: NodeJS.Timeout;
    let progressMs = 0; // Track progress in ms
    let progressInterval: NodeJS.Timeout;

    // Map device types to icons
    const deviceIcons = {
        Computer: LaptopIcon,
        Smartphone: SmartphoneIcon,
        Speaker: SpeakerIcon,
        GameConsole: Gamepad2Icon
    };

    async function fetchNowPlaying() {
        try {
            const response = await fetch('/api/spotify');
            if (response.ok) {
                const data = await response.json();
                nowPlaying = data.nowPlaying;

                // Calculate progress percentage and ms
                if (nowPlaying?.progress_ms && nowPlaying?.item?.duration_ms) {
                    progressMs = nowPlaying.progress_ms;
                    progress = (progressMs / nowPlaying.item.duration_ms) * 100;
                }

                devices = data.devices.devices; // Access the devices array
                activeDevice = devices?.find(device => device.is_active) || null; // Find the active device
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        }
    }

    function startProgressCounter() {
        // Clear any previous interval
        if (progressInterval) clearInterval(progressInterval);

        // Only start if we have valid data
        if (nowPlaying?.progress_ms && nowPlaying?.item?.duration_ms) {
            progressInterval = setInterval(() => {
                progressMs += 1000;
                if (nowPlaying && nowPlaying.item && progressMs > nowPlaying.item.duration_ms) {
                    progressMs = nowPlaying.item.duration_ms;
                }
                if (nowPlaying && nowPlaying.item) {
                    progress = (progressMs / nowPlaying.item.duration_ms) * 100;
                }
            }, 1000);
        }
    }

    onMount(() => {
        fetchNowPlaying().then(startProgressCounter);
        interval = setInterval(async () => {
            await fetchNowPlaying();
            startProgressCounter();
        }, 5000);
    });

    onDestroy(() => {
        // Clear the intervals when the component is destroyed
        clearInterval(interval);
        if (progressInterval) clearInterval(progressInterval);
    });
</script>

<Navbar />

<div class="flex flex-col gap-4 justify-center items-center min-h-screen">
  <!-- Original Card -->
  <Card.Root class="w-full max-w-sm shadow-md">
    <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
      <Avatar.Root>
        <Avatar.Image src="/favicon.jpg" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Card.Title>itsmatyii 🪐</Card.Title>
      <Card.Description>20 year old IT technician, hobby coder</Card.Description>
      <Card.Description>server administration/management, coding</Card.Description>
    </Card.Header>

    <Card.Content class="flex justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        href="https://github.com/matyii"
        target="_blank"
        aria-label="GitHub profile"
      >
        <Github />
      </Button>
      <Button
        variant="outline"
        size="icon"
        href="mailto:business@itsmatyii.fun"
        target="_blank"
        aria-label="Send email to business@itsmatyii.fun"
      >
        <Mail />
      </Button>
    </Card.Content>
  </Card.Root>

  <!-- Now Playing Card -->
  {#if nowPlaying && nowPlaying.item}
    <Card.Root class="w-full max-w-sm relative shadow-md">
      <!-- Music Icon -->
      <Music class="absolute top-5 right-5 w-6 h-6 text-muted-foreground" />
      <Card.Header class="text-muted-foreground font-extralight">
        <p>i'm currently listening to...</p>
      </Card.Header>
      <Card.Content class="flex gap-4">
        <!-- Album Cover -->
        <a
          href={nowPlaying.item.album.images[0].url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open album art in full size"
        >
          <div class="w-32 aspect-square overflow-hidden rounded shadow-md hover:scale-105 transition-all cursor-pointer bg-neutral-800 flex items-center justify-center">
            <img
              src={nowPlaying.item.album.images[1].url}
              alt="Album Art"
              class="w-full h-full object-cover"
            />
          </div>
        </a>

        <!-- Device Info and Progress Bar -->
        <div class="flex flex-col gap-2 w-full">
          <!-- Track Name with Link -->
          <p class="font-bold">
            <a href={nowPlaying.item.external_urls.spotify} target="_blank" class="text-primary hover:underline underline-offset-4">
              {nowPlaying.item.name}
            </a>
          </p>

          <!-- Artist(s) and Album with Links -->
          <p class="text-muted-foreground text-sm">
            {#each nowPlaying.item.artists as artist, i}
              <a href={artist.external_urls.spotify} target="_blank" class="hover:underline underline-offset-4">
                {artist.name}
              </a>{i < nowPlaying.item.artists.length - 1 ? ', ' : ''}
            {/each}
            •
            <a href={nowPlaying.item.album.external_urls.spotify} target="_blank" class="hover:underline underline-offset-4">
              {nowPlaying.item.album.name}
            </a>
          </p>

          <!-- Active Device Name with Icon -->
          {#if activeDevice}
            <p class="text-muted-foreground text-xs flex items-center gap-2">
              {#if deviceIcons[activeDevice.type as keyof typeof deviceIcons]}
                <svelte:component this={deviceIcons[activeDevice.type as keyof typeof deviceIcons]} class="w-4 h-4" />
              {/if}
              {activeDevice.name}
            </p>
          {/if}

          <!-- Progress Bar -->
          <div class="w-full mt-2">
            <Progress
              value={progress}
              class="h-1"
              aria-label="Song progress"
            />
            <div class="flex justify-between text-xs text-muted-foreground mt-1">
              <span>
                {Math.floor((progressMs || 0) / 60000)}:{String(Math.floor(((progressMs || 0) % 60000) / 1000)).padStart(2, '0')}
              </span>
              <span>
                {Math.floor(nowPlaying.item.duration_ms / 60000)}:{String(Math.floor((nowPlaying.item.duration_ms % 60000) / 1000)).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
</div>