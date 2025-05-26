<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import Navbar from "$lib/components/custom/Navbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { onMount, onDestroy } from 'svelte';
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { pageTitle } from "$lib/stores/title";
    pageTitle.set("")
    import { LaptopIcon, SmartphoneIcon, SpeakerIcon, Gamepad2Icon, Github, Mail, Music, CloudAlert, Inbox, ShoppingCart } from "@lucide/svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

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
    let progress = 0; 
    let interval: NodeJS.Timeout;
    let progressMs = 0; 
    let progressInterval: NodeJS.Timeout;

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

                if (nowPlaying?.progress_ms && nowPlaying?.item?.duration_ms) {
                    progressMs = nowPlaying.progress_ms;
                    progress = (progressMs / nowPlaying.item.duration_ms) * 100;
                }

                devices = data.devices.devices;
                activeDevice = devices?.find(device => device.is_active) || null;
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        }
    }

    function startProgressCounter() {
        if (progressInterval) clearInterval(progressInterval);

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
        clearInterval(interval);
        if (progressInterval) clearInterval(progressInterval);
    });
</script>

<Navbar />

<div class="flex flex-col items-center justify-center min-h-screen gap-4 w-full px-2 my-5">
  <!-- Row for the first two cards -->
  <div class="w-full flex flex-col lg:flex-row gap-4 justify-center items-center lg:items-stretch">
    <Card.Root class="w-full max-w-sm shadow-md flex flex-col h-full">
      <Card.Header class="flex flex-col items-center justify-center space-y-4 text-center">
        <Avatar.Root class="my-3 hover:scale-110 transition-all size-24">
          <Avatar.Image src="/favicon.jpg" alt="@matyii" />
          <Avatar.Fallback>MK</Avatar.Fallback>
        </Avatar.Root>
        <Card.Title>itsmatyii 🪐 | Kristóf Mátyás</Card.Title>
        <Card.Description>20 year old IT technician, hobby coder</Card.Description>
        <Card.Description>server administration/management, coding</Card.Description>
      </Card.Header>
      <Card.Content class="flex justify-center gap-2">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="default"
                size="icon"
                href="https://github.com/matyii"
                target="_blank"
                aria-label="GitHub profile"
              >
                <Github />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>My GitHub</span>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="default"
                size="icon"
                href="mailto:business@itsmatyii.fun"
                target="_blank"
                aria-label="Send email to business@itsmatyii.fun"
              >
                <Mail />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>Email me</span>
            </Tooltip.Content>
          </Tooltip.Root>

          <Separator orientation="vertical" class="mx-1" />

          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="default"
                size="icon"
                href="https://status.itsmatyii.dev"
                target="_blank"
                aria-label="Check status of services"
              >
                <CloudAlert />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>Services status</span>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Card.Content>
    </Card.Root>

    <Card.Root class="w-full max-w-sm shadow-md flex flex-col h-full">
      <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
        <Card.Title>itsmatyii network</Card.Title>
        <Card.Description>services, tools, and websites i manage</Card.Description>
      </Card.Header>
      <Card.Content class="flex-1 flex flex-col gap-4 justify-between">
        <ScrollArea class="flex flex-col w-full max-h-56 p-1">
          <div class="flex gap-3 flex-col">
            <a
            href="https://matyas.services"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-4 rounded-lg shadow cursor-pointer w-full transition-all border border-border hover:shadow-lg hover:bg-muted"
            aria-label="Network Status"
          >
            <img src="https://matyas.services/favicon.png" alt="Status" class="w-12 h-12 object-cover rounded-md" />
            <div class="flex flex-col items-start">
              <span class="font-semibold text-lg">matyas.services</span>
              <span class="text-muted-foreground text-sm">offering server management, web development (soon)</span>
            </div>
          </a>
          <a
            href="https://screenie.host"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-4 rounded-lg shadow cursor-pointer w-full transition-all border border-border hover:shadow-lg hover:bg-muted"
            aria-label="screenie.host"
          >
            <img src="screenie.png" alt="Services" class="h-10 object-cover rounded-md" />
            <div class="flex flex-col items-start">
              <span class="font-semibold text-lg">screenie.host</span>
              <span class="text-muted-foreground text-sm">screenshot and file uploading service (wip)</span>
            </div>
          </a>
          </div>
        </ScrollArea>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Spotify card below, full width on mobile, centered on desktop -->
  {#if nowPlaying && nowPlaying.item}
    <div class="w-full flex justify-center">
      <Card.Root class="max-w-sm w-full shadow-md flex flex-col h-full relative mt-4">
        <Music class="w-6 h-6 text-muted-foreground absolute top-5 right-6" />
        <Card.Header class="text-muted-foreground font-extralight">
          <p>i'm currently listening to...</p>
        </Card.Header>
        <Card.Content class="flex gap-4">
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
          <div class="flex flex-col gap-2 w-full">
            <p class="font-bold">
              <a href={nowPlaying.item.external_urls.spotify} target="_blank" class="text-primary hover:underline underline-offset-4">
                {nowPlaying.item.name}
              </a>
            </p>

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

            {#if activeDevice}
              <p class="text-muted-foreground text-xs flex items-center gap-2">
                {#if deviceIcons[activeDevice.type as keyof typeof deviceIcons]}
                  <svelte:component this={deviceIcons[activeDevice.type as keyof typeof deviceIcons]} class="w-4 h-4" />
                {/if}
                {activeDevice.name}
              </p>
            {/if}

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
    </div>
  {/if}
</div>