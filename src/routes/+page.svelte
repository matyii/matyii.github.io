<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    
    import Button from "$lib/components/ui/button/button.svelte";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { pageTitle } from "$lib/stores/title";
    pageTitle.set("")
    import { LaptopIcon, SmartphoneIcon, SpeakerIcon, Gamepad2Icon, Github, Mail, Music, CloudAlert, Linkedin } from "@lucide/svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { spotify } from "$lib/stores/spotify";
    const { nowPlaying, activeDevice, progress, progressMs } = spotify;
    type DeviceType = 'Computer' | 'Smartphone' | 'Speaker' | 'GameConsole';
    const deviceIcons: Record<DeviceType, typeof LaptopIcon> = {
        Computer: LaptopIcon,
        Smartphone: SmartphoneIcon,
        Speaker: SpeakerIcon,
        GameConsole: Gamepad2Icon
    };
</script>



<div class="relative flex flex-col items-center justify-center min-h-screen gap-4 w-full px-2 my-5">
  <div class="w-full flex flex-col lg:flex-row gap-4 justify-center items-center lg:items-stretch">
    <Card.Root class="w-full max-w-sm shadow-md flex flex-col h-full bg-white/10 backdrop-blur-2xl border border-white/30 rounded-xl text-white">
      <Card.Header class="flex flex-col items-center justify-center space-y-4 text-center">
        <Avatar.Root class="my-3 hover:scale-110 transition-all size-28 border-4 border-white/40 hover:border-indigo-300/80">
          <Avatar.Image src="/pfp.png" alt="@matyii" />
          <Avatar.Fallback>MK</Avatar.Fallback>
        </Avatar.Root>
        <Card.Title>Kristóf Mátyás</Card.Title>
        <Card.Description class="text-neutral-300">20 year old IT technician, hobby coder</Card.Description>
        <Card.Description class="text-neutral-300">server administration/management, coding</Card.Description>
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
                href="mailto:matyas@matyas.services"
                target="_blank"
                aria-label="Send email to matyas@matyas.services"
              >
                <Mail />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>Email me</span>
            </Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="default"
                size="icon"
                href="https://www.linkedin.com/in/itsmatyii/"
                target="_blank"
                aria-label="Open my Linkedin page"
              >
                <Linkedin />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>My Linkedin</span>
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

    <Card.Root class="w-full max-w-sm shadow-md flex flex-col h-full bg-white/10 backdrop-blur-2xl border border-white/30 rounded-xl text-white">
      <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
        <Card.Title>itsmatyii network</Card.Title>
        <Card.Description class="text-neutral-700 dark:text-neutral-300">services, tools, and websites i manage</Card.Description>
      </Card.Header>
      <Card.Content class="flex-1 flex flex-col gap-4 justify-between">
        <ScrollArea class="flex flex-col w-full max-h-56 p-1">
          <div class="flex gap-3 flex-col">
            <a
            href="https://selfhostguides.diy"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-4 rounded-xl shadow cursor-pointer w-full transition-all border border-white/30 bg-white/10 backdrop-blur-xl hover:shadow-lg hover:bg-white/20"
            aria-label="selfhostguides.diy"
          >
            <img src="https://selfhostguides.diy/shg.png" alt="selfhostguides.diy" class="h-10 object-cover rounded-md" />
            <div class="flex flex-col items-start">
              <span class="font-semibold text-lg">selfhostguides.diy</span>
              <span class="text-neutral-700 dark:text-neutral-300 text-sm">guides and resources from the selfhosting community</span>
            </div>
            </a>
            <a
            href="https://matyas.services"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-4 rounded-xl shadow cursor-pointer w-full transition-all border border-white/30 bg-white/10 backdrop-blur-xl hover:shadow-lg hover:bg-white/20"
            aria-label="Network Status"
          >
            <img src="https://matyas.services/favicon.png" alt="Status" class="w-12 h-12 object-cover rounded-md" />
            <div class="flex flex-col items-start">
              <span class="font-semibold text-lg">matyas.services</span>
              <span class="text-neutral-700 dark:text-neutral-300 text-sm">offering server management, web development (soon)</span>
            </div>
          </a>
            <!-- <a
            href="https://screenie.host"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-4 rounded-xl shadow cursor-pointer w-full transition-all border border-white/30 bg-white/10 backdrop-blur-xl hover:shadow-lg hover:bg-white/20"
            aria-label="screenie.host"
          >
            <img src="screenie.png" alt="Services" class="h-10 object-cover rounded-md" />
            <div class="flex flex-col items-start">
              <span class="font-semibold text-lg">screenie.host</span>
              <span class="text-neutral-700 dark:text-neutral-300 text-sm">screenshot and file uploading service (wip)</span>
            </div>
          </a> -->
          </div>
        </ScrollArea>
      </Card.Content>
    </Card.Root>
  </div>

  {#if $nowPlaying && $nowPlaying.item}
    <div class="w-full flex justify-center">
      <Card.Root class="max-w-sm w-full shadow-md flex flex-col h-full relative mt-4 bg-white/30 dark:bg-white/10 backdrop-blur-3xl border border-white/30 rounded-xl text-black dark:text-white">
        <Music class="w-6 h-6 text-neutral-300 dark:text-neutral-100 absolute top-5 right-6" />
        <Card.Header class="font-extralight">
          <p class="text-neutral-700 dark:text-neutral-300">i'm currently listening to...</p>
        </Card.Header>
        <Card.Content class="flex gap-4">
          <a
            href={$nowPlaying.item.album.images[0].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open album art in full size"
          >
            <div class="w-32 aspect-square overflow-hidden rounded shadow-md hover:scale-105 transition-all cursor-pointer bg-neutral-800 flex items-center justify-center">
              <img
                src={$nowPlaying.item.album.images[1].url}
                alt="Album Art"
                class="w-full h-full object-cover"
              />
            </div>
          </a>
          <div class="flex flex-col gap-2 w-full">
            <p class="font-bold">
              <a href={$nowPlaying.item.external_urls.spotify} target="_blank" class="text-primary hover:underline underline-offset-4">
                {$nowPlaying.item.name}
              </a>
            </p>

            <p class="text-neutral-700 dark:text-neutral-300 text-sm">
              {#each $nowPlaying.item.artists as artist, i}
                <a href={artist.external_urls.spotify} target="_blank" class="hover:underline underline-offset-4">
                  {artist.name}
                </a>{i < $nowPlaying.item.artists.length - 1 ? ', ' : ''}
              {/each}
              •
              <a href={$nowPlaying.item.album.external_urls.spotify} target="_blank" class="hover:underline underline-offset-4">
                {$nowPlaying.item.album.name}
              </a>
            </p>

            {#if $activeDevice}
              <span class="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 text-xs">
                {#if deviceIcons[$activeDevice.type as DeviceType]}
                  <svelte:component this={deviceIcons[$activeDevice.type as DeviceType]} class="w-4 h-4" />
                {/if}
                <span class="truncate max-w-[8rem]">{$activeDevice.name}</span>
              </span>
            {/if}

            <div class="w-full mt-2">
              <Progress
                value={$progress}
                class="h-1"
                aria-label="Song progress"
              />
              <div class="flex justify-between text-xs text-neutral-700 dark:text-neutral-300 mt-1">
                <span>
                  {Math.floor(($progressMs || 0) / 60000)}:{String(Math.floor((($progressMs || 0) % 60000) / 1000)).padStart(2, '0')}
                </span>
                <span>
                  {Math.floor($nowPlaying.item.duration_ms / 60000)}:{String(Math.floor(($nowPlaying.item.duration_ms % 60000) / 1000)).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {/if}
</div>