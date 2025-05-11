<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import Navbar from "$lib/components/custom/Navbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { onMount, onDestroy } from 'svelte';

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

                // Calculate progress percentage
                if (nowPlaying?.progress_ms && nowPlaying?.item?.duration_ms) {
                    progress = (nowPlaying.progress_ms / nowPlaying.item.duration_ms) * 100;
                }

                devices = data.devices.devices; // Access the devices array
                activeDevice = devices?.find(device => device.is_active) || null; // Find the active device
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        }
    }

    onMount(() => {
        // Fetch data immediately and then periodically
        fetchNowPlaying();
        interval = setInterval(fetchNowPlaying, 5000); // Refresh every 2 seconds
    });

    onDestroy(() => {
        // Clear the interval when the component is destroyed
        clearInterval(interval);
    });
</script>

<Navbar />

<div class="flex flex-col gap-4 justify-center items-center min-h-screen">
  <!-- Original Card -->
  <Card.Root class="w-full max-w-sm shadow-md">
    <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/matyii.png" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Card.Title>itsmatyii 🪐</Card.Title>
      <Card.Description>20 year old IT technician, hobby coder</Card.Description>
      <Card.Description>server administration/management, coding</Card.Description>
    </Card.Header>

    <Card.Content class="flex justify-center gap-2">
      <Button variant="outline" size="icon" href="https://github.com/matyii" target="_blank"><Github /></Button>
      <Button variant="outline" size="icon" href="mailto:business@itsmatyii.fun" target="_blank"><Mail /></Button>
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
        <img
          src={nowPlaying.item.album.images[0].url}
          alt="Album Art"
          class="w-32 h-full object-cover rounded shadow-md hover:scale-105 transition-all"
        />

        <!-- Device Info and Progress Bar -->
        <div class="flex flex-col gap-2 w-full">
          <!-- Track Name with Link -->
          <p class="font-bold">
            <a href={nowPlaying.item.external_urls.spotify} target="_blank" class="text-primary hover:underline">
              {nowPlaying.item.name}
            </a>
          </p>

          <!-- Artist(s) and Album with Links -->
          <p class="text-muted-foreground text-sm">
            {#each nowPlaying.item.artists as artist, i}
              <a href={artist.external_urls.spotify} target="_blank" class="hover:underline">
                {artist.name}
              </a>{i < nowPlaying.item.artists.length - 1 ? ', ' : ''}
            {/each}
            •
            <a href={nowPlaying.item.album.external_urls.spotify} target="_blank" class="hover:underline">
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
            <Progress value={progress} class="h-1" />
            <div class="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.floor((nowPlaying.progress_ms || 0) / 60000)}:{String(Math.floor(((nowPlaying.progress_ms || 0) % 60000) / 1000)).padStart(2, '0')}</span>
              <span>{Math.floor(nowPlaying.item.duration_ms / 60000)}:{String(Math.floor((nowPlaying.item.duration_ms % 60000) / 1000)).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
</div>