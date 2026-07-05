<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { pageTitle } from "$lib/stores/title";
    import {
      ArrowRight,
      CloudAlert,
      Gamepad2Icon,
      Github,
      LaptopIcon,
      Linkedin,
      Mail,
      MapPin,
      Music,
      SmartphoneIcon,
      SpeakerIcon
    } from "@lucide/svelte";
    import { spotify } from "$lib/stores/spotify";
    import { onMount } from "svelte";
    import { normalizeProject } from "$lib/utils/projects";
    import type { Project, RawProject } from "$lib/types/project";

    pageTitle.set("");

    type DeviceType = "Computer" | "Smartphone" | "Speaker" | "GameConsole";

    const { nowPlaying, activeDevice, progress, progressMs } = spotify;

    const deviceIcons: Record<DeviceType, typeof LaptopIcon> = {
      Computer: LaptopIcon,
      Smartphone: SmartphoneIcon,
      Speaker: SpeakerIcon,
      GameConsole: Gamepad2Icon
    };

    const techStack = ["SvelteKit", "TypeScript", "Tailwind", "Node.js", "PostgreSQL", "Docker"];
    const highlights = [
      "Production-ready full stack projects",
      "Infrastructure and deployment experience",
      "Strong focus on clean UX and performance"
    ];

    type SocialLink = {
      label: string;
      href: string;
      ariaLabel: string;
      icon: typeof Github;
      external?: boolean;
    };

    const socialLinks: SocialLink[] = [
      {
        label: "GitHub",
        href: "https://github.com/matyii",
        ariaLabel: "GitHub profile",
        icon: Github,
        external: true
      },
      {
        label: "Email",
        href: "mailto:matyas@matyas.services",
        ariaLabel: "Email",
        icon: Mail
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/itsmatyii/",
        ariaLabel: "LinkedIn profile",
        icon: Linkedin,
        external: true
      },
      {
        label: "Status",
        href: "https://status.matyas.services",
        ariaLabel: "Service status",
        icon: CloudAlert,
        external: true
      }
    ];

    type DiscordStatus = "online" | "idle" | "dnd" | "offline" | "unknown";

    type DiscordActivity = {
      application_id?: string;
      assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
      };
      buttons?: string[];
      created_at?: number;
      details?: string;
      flags?: number;
      id?: string;
      name?: string;
      platform?: string;
      session_id?: string;
      state?: string;
      timestamps?: {
        start?: number;
        end?: number;
      };
      type?: number;
    };

    type DiscordPresenceData = {
      kv?: Record<string, string>;
      discord_user?: {
        avatar?: string;
        banner?: string;
        bot?: boolean;
        accent_color?: number | null;
        discriminator?: string;
        display_name?: string;
        display_name_styles?: {
          colors?: number[];
          effect_id?: number;
          font_id?: number;
        };
        global_name?: string;
        id?: string;
        public_flags?: number;
        username?: string;
        avatar_decoration_data?: {
          asset?: string;
          expires_at?: number | null;
          sku_id?: string;
        };
        collectibles?: {
          nameplate?: {
            asset?: string;
            expires_at?: number | null;
            label?: string;
            palette?: string;
            sku_id?: string;
          };
        };
        primary_guild?: {
          badge?: string;
          identity_enabled?: boolean;
          identity_guild_id?: string;
          tag?: string;
        };
      };
      activities?: DiscordActivity[];
      discord_status?: string;
      active_on_discord_web?: boolean;
      active_on_discord_desktop?: boolean;
      active_on_discord_mobile?: boolean;
      active_on_discord_embedded?: boolean;
      active_on_discord_vr?: boolean;
      listening_to_spotify?: boolean;
      spotify?: {
        song?: string;
        artist?: string;
        album?: string;
        album_art_url?: string;
        track_id?: string;
        timestamps?: {
          start?: number;
          end?: number;
        };
      } | null;
    };

    type DiscordPresence = {
      available: boolean;
      status: DiscordStatus;
      activity: string | null;
      bannerUrl?: string | null;
      reason?: string;
      data?: DiscordPresenceData;
    };

    type DiscordBadge = {
      label: string;
      icon: string;
    };

    const discordStatusLabel: Record<DiscordStatus, string> = {
      online: "Online",
      idle: "Idle",
      dnd: "Do not disturb",
      offline: "Offline",
      unknown: "Unavailable"
    };

    const discordDotClass: Record<DiscordStatus, string> = {
      online: "bg-emerald-500",
      idle: "bg-amber-500",
      dnd: "bg-rose-500",
      offline: "bg-muted-foreground/40",
      unknown: "bg-muted-foreground/40"
    };

    let featuredProjects: Project[] = [];
    let discordPresence: DiscordPresence = {
      available: false,
      status: "unknown",
      activity: null
    };
    let discordNowMs = Date.now();

    $: discordUser = discordPresence.data?.discord_user;
    $: discordActivities = discordPresence.data?.activities ?? [];
    $: discordAvatarUrl =
      discordUser?.id && discordUser?.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
        : null;
    $: discordDecorationUrl = discordUser?.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${discordUser.avatar_decoration_data.asset}.png?size=128&passthrough=true`
      : null;
    $: discordBannerHashUrl =
      discordUser?.id && discordUser?.banner
        ? `https://cdn.discordapp.com/banners/${discordUser.id}/${discordUser.banner}.${discordUser.banner.startsWith("a_") ? "gif" : "png"}?size=600`
        : null;
    $: discordBannerUrl = discordPresence.bannerUrl || discordBannerHashUrl;
    $: discordAccentColor =
      typeof discordUser?.accent_color === "number"
        ? `#${discordUser.accent_color.toString(16).padStart(6, "0")}`
        : "#1e293b";
    $: clanBadgeUrl =
      discordUser?.primary_guild?.identity_guild_id && discordUser?.primary_guild?.badge
        ? `https://cdn.discordapp.com/clan-badges/${discordUser.primary_guild.identity_guild_id}/${discordUser.primary_guild.badge}.png`
        : null;
    $: userBadges = getDiscordPublicBadges(discordUser?.public_flags);

    function formatUnixTimestamp(ms?: number) {
      if (!ms) return "-";
      return new Date(ms).toLocaleString();
    }

    function formatActivityType(type?: number) {
      if (type === 0) return "Playing";
      if (type === 1) return "Streaming";
      if (type === 2) return "Listening";
      if (type === 3) return "Watching";
      if (type === 4) return "Custom";
      if (type === 5) return "Competing";
      return "Activity";
    }

    function formatElapsedFromStart(ms?: number, nowMs = Date.now()) {
      if (!ms) return null;
      const elapsedSeconds = Math.max(0, Math.floor((nowMs - ms) / 1000));
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = elapsedSeconds % 60;

      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      const totalMinutes = Math.floor(elapsedSeconds / 60);
      return `${totalMinutes}:${String(seconds).padStart(2, "0")}`;
    }

    async function fetchDiscordPresence() {
      try {
        const response = await fetch("/api/discord", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json() as DiscordPresence;
        discordPresence = payload;
      } catch (error) {
        console.error("Failed to refresh Discord presence", error);
      }
    }

    function resolveActivityAssetUrl(asset?: string) {
      if (!asset) return null;
      if (asset.startsWith("http://") || asset.startsWith("https://")) return asset;

      const urlStart = asset.indexOf("https/");
      if (urlStart >= 0) {
        return `https://${asset.slice(urlStart + "https/".length)}`;
      }

      return null;
    }

    function getDiscordPublicBadges(flags?: number) {
      if (!flags) return [] as DiscordBadge[];

      const badgeBase = "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets";
      const badgeFlags: Array<{ bit: number; label: string; icon: string }> = [
        { bit: 1 << 0, label: "Discord Staff", icon: `${badgeBase}/discord-staff.svg` },
        { bit: 1 << 1, label: "Partnered Server Owner", icon: `${badgeBase}/discord-partner.svg` },
        { bit: 1 << 2, label: "HypeSquad Events", icon: `${badgeBase}/hype-squad-events.svg` },
        { bit: 1 << 3, label: "Bug Hunter Level 1", icon: `${badgeBase}/discord-bug-hunter-green.svg` },
        { bit: 1 << 6, label: "HypeSquad Bravery", icon: `${badgeBase}/hype-squad-bravery.svg` },
        { bit: 1 << 7, label: "HypeSquad Brilliance", icon: `${badgeBase}/hype-squad-brilliance.svg` },
        { bit: 1 << 9, label: "Early Supporter", icon: `${badgeBase}/discord-early-supporter.svg` },
        { bit: 1 << 14, label: "Bug Hunter Level 2", icon: `${badgeBase}/discord-bug-hunter-gold.svg` },
        { bit: 1 << 17, label: "Verified Bot Developer", icon: `${badgeBase}/discord-bot-dev.svg` },
        { bit: 1 << 22, label: "Active Developer", icon: `${badgeBase}/active-developer.svg` }
      ];

      return badgeFlags.filter((entry) => (flags & entry.bit) !== 0);
    }

    onMount(() => {
      const loadInitialData = async () => {
        try {
          const projectsResult = await fetch("/data/projects.json");
          const rawProjects: RawProject[] = await projectsResult.json();
          const projects = rawProjects.map(normalizeProject);
          const explicitlyFeatured = projects.filter((project) => project.featured);
          featuredProjects = (explicitlyFeatured.length > 0 ? explicitlyFeatured : projects).slice(0, 3);
        } catch (error) {
          console.error("Failed to load featured projects", error);
        }

        await fetchDiscordPresence();
      };

      void loadInitialData();

      const discordRefreshInterval = window.setInterval(() => {
        void fetchDiscordPresence();
      }, 5000);

      const elapsedTickInterval = window.setInterval(() => {
        discordNowMs = Date.now();
      }, 1000);

      return () => {
        window.clearInterval(discordRefreshInterval);
        window.clearInterval(elapsedTickInterval);
      };
    });
</script>

<section class="grid items-start gap-6 lg:grid-cols-[1.3fr_0.9fr]">
  <div class="space-y-4">
    <Card.Root class="surface-panel border-white/10 p-6 md:p-8 lg:p-10">
      <Card.Content class="space-y-7 p-0">
        <div class="flex flex-wrap items-center gap-2">
          <Badge class="rounded-full border border-emerald-400/40 bg-emerald-100/80 px-3 py-1 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-400/10 dark:text-emerald-200" variant="outline">
            Available for collaborations
          </Badge>
          <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin class="size-3.5" />
            Slovakia
          </span>
        </div>

        <div class="space-y-4">
          <h1 class="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Building reliable software with
            <span class="title-accent text-primary"> product-level polish.</span>
          </h1>
          <p class="text-balance max-w-2xl text-base text-muted-foreground sm:text-lg">
            I am Kristof Matyas, an engineer focused on shipping clean user experiences,
            practical infrastructure, and maintainable codebases that scale.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          {#each techStack as item}
            <Badge variant="secondary" class="rounded-full px-3 py-1 text-xs font-medium tracking-wide">
              {item}
            </Badge>
          {/each}
        </div>

        <div class="grid gap-2 sm:grid-cols-3">
          {#each highlights as highlight}
            <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/[0.03]">
              {highlight}
            </div>
          {/each}
        </div>

        <div class="flex flex-wrap gap-3">
          <Button href="/projects" class="rounded-xl px-5">
            Explore projects
            <ArrowRight class="size-4" />
          </Button>
          <Button href="/cv" variant="secondary" class="rounded-xl px-5">
            View CV
          </Button>
          <Button href="mailto:matyas@matyas.services" variant="ghost" class="rounded-xl px-5">
            Contact me
          </Button>
        </div>

      </Card.Content>
    </Card.Root>

    {#if $nowPlaying && $nowPlaying.item}
      <Card.Root class={`surface-panel p-5 md:p-6 ${$nowPlaying.is_stale ? "border-amber-400/45 bg-amber-50/65 dark:border-amber-300/35 dark:bg-amber-500/10" : "border-black/10 dark:border-white/10"}`}>
        <Card.Header class="mb-4 flex flex-row items-center justify-between p-0">
          <div>
            <Card.Title class="text-lg">Now playing</Card.Title>
            <Card.Description class="text-sm">
              {$nowPlaying.is_playing ? "Spotify live status" : ($nowPlaying.is_stale ? "Last played music" : "Paused recently")}
            </Card.Description>
          </div>
          <Music class={`size-5 ${$nowPlaying.is_stale ? "text-amber-600 dark:text-amber-300" : "text-muted-foreground"}`} />
        </Card.Header>

        {#if $nowPlaying.is_stale}
          <div class="mb-3 rounded-lg border border-amber-400/40 bg-amber-100/70 px-3 py-2 text-xs text-amber-800 dark:border-amber-300/30 dark:bg-amber-400/10 dark:text-amber-200">
            Playback has been paused for a while. Showing your last played track.
          </div>
        {/if}

        <Card.Content class="space-y-4 p-0">
          <div class="flex gap-3">
            <img
              src={$nowPlaying.item.album.images[1]?.url || $nowPlaying.item.album.images[0]?.url}
              alt="Album artwork"
              class="size-20 rounded-xl border border-white/10 object-cover shadow-soft"
              loading="lazy"
            />
            <div class="min-w-0 flex-1 space-y-1">
              <a
                href={$nowPlaying.item.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                class="block truncate text-sm font-semibold hover:text-primary"
              >
                {$nowPlaying.item.name}
              </a>
              <p class="truncate text-xs text-muted-foreground">
                {#each $nowPlaying.item.artists as artist, i}
                  <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" class="hover:text-foreground">
                    {artist.name}
                  </a>{i < $nowPlaying.item.artists.length - 1 ? ", " : ""}
                {/each}
              </p>
              <p class="truncate text-xs text-muted-foreground">
                <a
                  href={$nowPlaying.item.album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-foreground"
                >
                  {$nowPlaying.item.album.name}
                </a>
              </p>
            </div>
          </div>

          {#if $activeDevice}
            <div class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground">
              {#if deviceIcons[$activeDevice.type as DeviceType]}
                <svelte:component this={deviceIcons[$activeDevice.type as DeviceType]} class="size-3.5" />
              {/if}
              <span class="truncate">{$activeDevice.name}</span>
            </div>
          {/if}

          <div>
            <Progress value={$progress} class="h-1.5" aria-label="Song progress" />
            <div class="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>{Math.floor(($progressMs || 0) / 60000)}:{String(Math.floor((($progressMs || 0) % 60000) / 1000)).padStart(2, "0")}</span>
              <span>{Math.floor($nowPlaying.item.duration_ms / 60000)}:{String(Math.floor(($nowPlaying.item.duration_ms % 60000) / 1000)).padStart(2, "0")}</span>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    {:else}
      <Card.Root class="surface-panel border-black/10 p-5 md:p-6 dark:border-white/10">
        <Card.Header class="p-0">
          <Card.Title class="text-lg">Nothing is playing</Card.Title>
          <Card.Description class="text-sm">Spotify is currently inactive.</Card.Description>
        </Card.Header>
      </Card.Root>
    {/if}
  </div>

  <div class="space-y-4">
    {#if discordPresence.available}
    <Card.Root class="surface-panel overflow-hidden border-black/10 p-0 dark:border-white/10">
      <div class="relative h-32 w-full">
        {#if discordBannerUrl}
          <img
            src={discordBannerUrl}
            alt="Discord banner"
            class="h-full w-full object-cover transition-opacity duration-700"
            loading="lazy"
          />
        {:else}
          <div
            class="h-full w-full"
            style={`background: linear-gradient(120deg, ${discordAccentColor} 0%, #0f172a 58%, #020617 100%);`}
          ></div>
        {/if}
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/35 dark:via-black/15 dark:to-black/45"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-slate-100/28 to-slate-100/58 dark:via-background/42 dark:to-background/85"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-slate-100/0 to-slate-100/46 dark:from-background/8 dark:to-background/65"></div>
        <div class="pointer-events-none absolute inset-x-4 -bottom-7 h-16 rounded-full bg-slate-100/45 blur-2xl dark:bg-background/70"></div>
      </div>

      <Card.Header class="mb-4 flex flex-row items-center justify-between px-5 pt-5 md:px-6 md:pt-6">
        <div>
          <Card.Title class="text-lg">Discord status</Card.Title>
        </div>
        <div class="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span class={`size-2 rounded-full ${discordDotClass[discordPresence.status]}`}></span>
          <span>{discordStatusLabel[discordPresence.status]}</span>
        </div>
      </Card.Header>

      <Card.Content class="space-y-4 px-5 pb-5 pt-0 text-sm md:px-6 md:pb-6">
        {#if discordUser}
          <div class="rounded-xl border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
            <div class="flex items-start gap-3">
              {#if discordAvatarUrl}
                <div class="relative size-14 shrink-0 overflow-visible">
                  <img src={discordAvatarUrl} alt="Discord avatar" class="size-full rounded-full border border-black/10 object-cover dark:border-white/10" loading="lazy" />
                  {#if discordDecorationUrl}
                    <img
                      src={discordDecorationUrl}
                      alt="Avatar decoration"
                      class="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[122%] w-[122%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                      loading="lazy"
                    />
                  {/if}
                </div>
              {/if}
              <div class="min-w-0 flex-1">
                <p class="truncate text-base font-semibold text-foreground">{discordUser.display_name || discordUser.global_name || discordUser.username}</p>
                <p class="truncate text-xs text-muted-foreground">@{discordUser.username}{discordUser.discriminator && discordUser.discriminator !== "0" ? `#${discordUser.discriminator}` : ""}</p>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  {#if discordUser.primary_guild?.tag}
                    <Badge variant="secondary" class="rounded-full text-[11px]">
                      {#if clanBadgeUrl}
                        <img src={clanBadgeUrl} alt="Guild badge" class="mr-1 size-3.5 rounded-sm object-cover" loading="lazy" />
                      {/if}
                      {discordUser.primary_guild.tag}
                    </Badge>
                  {/if}
                  {#each userBadges as badge}
                    <span class="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.03]" title={badge.label} aria-label={badge.label}>
                      <img src={badge.icon} alt={badge.label} class="size-4 object-contain" loading="lazy" />
                    </span>
                  {/each}
                </div>
              </div>
            </div>

          </div>
        {/if}

        {#if discordPresence.data?.spotify}
          <div class="rounded-xl border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Discord Spotify</p>
            <div class="mt-2 space-y-1 text-xs text-muted-foreground">
              <p class="font-medium text-foreground">{discordPresence.data.spotify.song || "Unknown track"}</p>
              <p>{discordPresence.data.spotify.artist || "Unknown artist"}</p>
              <p>{discordPresence.data.spotify.album || "Unknown album"}</p>
            </div>
          </div>
        {/if}

        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Activities ({discordActivities.length})</p>
          {#if discordActivities.length > 0}
            {#each discordActivities as activity}
              <div class="rounded-2xl border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <p class="mb-2 text-xs font-medium text-muted-foreground">{formatActivityType(activity.type)}</p>

                <div class="flex gap-3">
                  <div class="size-16 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/20 dark:border-white/10">
                    {#if resolveActivityAssetUrl(activity.assets?.large_image)}
                      <img
                        src={resolveActivityAssetUrl(activity.assets?.large_image)}
                        alt={activity.assets?.large_text || activity.name || "Activity image"}
                        class="h-full w-full object-cover"
                        loading="lazy"
                      />
                    {/if}
                  </div>

                  <div class="min-w-0 flex-1 space-y-0.5">
                    <p class="truncate text-foreground font-semibold">{activity.name || "Unknown activity"}</p>
                    {#if activity.details}
                      <p class="truncate text-xs text-muted-foreground">{activity.details}</p>
                    {/if}
                    {#if activity.state}
                      <p class="truncate text-xs text-muted-foreground">{activity.state}</p>
                    {/if}

                    <div class="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-300">
                      {#if resolveActivityAssetUrl(activity.assets?.small_image)}
                        <img
                          src={resolveActivityAssetUrl(activity.assets?.small_image)}
                          alt={activity.assets?.small_text || "Activity icon"}
                          class="size-4 rounded-full border border-black/10 object-cover dark:border-white/10"
                          loading="lazy"
                        />
                      {/if}
                      <span class="font-medium">{formatElapsedFromStart(activity.timestamps?.start, discordNowMs) || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {:else}
            <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/[0.03]">No active activities.</div>
          {/if}
        </div>

      </Card.Content>
    </Card.Root>
    {/if}

    <Card.Root class="surface-panel border-black/10 p-3 sm:p-4 dark:border-white/10">
      <Card.Content class="space-y-2 p-0">
        <p class="px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Connect</p>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {#each socialLinks as link}
            <Button
              variant="ghost"
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.ariaLabel}
              class="group h-12 justify-start rounded-xl border border-black/15 bg-black/[0.03] px-3 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-black/[0.06] hover:text-foreground focus-visible:ring-primary/60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.08]"
            >
              <span class="inline-flex size-7 items-center justify-center rounded-full bg-black/[0.06] transition-colors duration-300 group-hover:bg-primary/15 dark:bg-white/[0.06]">
                <svelte:component this={link.icon} class="size-3.5" />
              </span>
              <span class="text-xs font-medium">{link.label}</span>
            </Button>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</section>

<section class="mt-10 space-y-4">
  <div class="flex items-end justify-between">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight">Featured projects</h2>
      <p class="text-sm text-muted-foreground">Selected work that blends engineering depth with product usability.</p>
    </div>
    <Button href="/projects" variant="ghost" class="rounded-xl">See all</Button>
  </div>

  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {#each featuredProjects as project}
      <a href={`/projects/${project.url}`} class="group surface-panel border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
        <div class="aspect-[16/10] overflow-hidden bg-black/30">
          <img
            src={`/img/projects/${project.url}/${project.heroImage}`}
            alt={project.title}
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div class="space-y-3 p-4">
          <h3 class="text-lg font-semibold tracking-tight">{project.title}</h3>
          <p class="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          <div class="flex flex-wrap gap-1.5">
            {#each project.badges.slice(0, 3) as badge}
              <Badge variant="outline" class="rounded-full text-[11px]">{badge.label}</Badge>
            {/each}
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>