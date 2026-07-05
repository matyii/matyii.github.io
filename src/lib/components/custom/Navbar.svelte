<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { mode, toggleMode } from "mode-watcher";
  import {
    Briefcase,
    FileText,
    Home,
    Menu,
    Moon,
    Sun,
    X
  } from "@lucide/svelte";

  type NavItem = {
    href: string;
    label: string;
    shortLabel: string;
    icon: typeof Home;
  };

  const navItems: NavItem[] = [
    { href: "/", label: "Home", shortLabel: "Home", icon: Home },
    { href: "/projects", label: "Projects", shortLabel: "Work", icon: Briefcase },
    { href: "/cv", label: "CV", shortLabel: "CV", icon: FileText }
  ];

  let mobileMenuOpen = false;
  let scrolled = false;

  $: currentPath = $page.url.pathname;

  function isActivePath(path: string): boolean {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      mobileMenuOpen = false;
    }
  }

  function handleScroll() {
    scrolled = window.scrollY > 16;
  }
</script>

<svelte:window on:keydown={handleGlobalKeydown} on:scroll={handleScroll} />

<header class="fixed inset-x-0 top-4 z-50 px-3 md:px-6">
  <div
    class={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-3 py-2 md:px-4 md:py-3 ${
      scrolled
        ? "bg-background/70 shadow-panel border-black/15 backdrop-blur-2xl dark:border-white/15"
        : "bg-background/55 border-black/10 backdrop-blur-xl dark:border-white/10"
    }`}
  >
    <a href="/" class="group flex items-center gap-3 rounded-xl px-1 py-1" aria-label="Go to home">
      <Avatar.Root class="size-9 rounded-full border border-black/20 shadow-soft transition-transform duration-300 group-hover:scale-[1.04] dark:border-white/20">
        <Avatar.Image src="/img/pfps/pfp.png" alt="Profile image" class="rounded-full" />
        <Avatar.Fallback class="text-xs font-semibold">KM</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-semibold tracking-tight">itsmatyii.dev</span>
        <span class="text-[11px] text-muted-foreground">software engineer portfolio</span>
      </div>
    </a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
      {#each navItems as item}
        <a
          href={item.href}
          class={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
            isActivePath(item.href)
              ? "bg-primary/20 text-foreground shadow-soft"
              : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
          }`}
          aria-current={isActivePath(item.href) ? "page" : undefined}
        >
          <svelte:component this={item.icon} class="size-4" />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-2">
      <button
        class="inline-flex size-9 items-center justify-center rounded-lg border border-black/10 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
        type="button"
        on:click={toggleMode}
        aria-label="Toggle theme"
      >
        {#if $mode === "dark"}
          <Sun class="size-4" />
        {:else}
          <Moon class="size-4" />
        {/if}
      </button>

      <button
        class="inline-flex size-9 items-center justify-center rounded-lg border border-black/10 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 md:hidden"
        type="button"
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {#if mobileMenuOpen}
          <X class="size-4" />
        {:else}
          <Menu class="size-4" />
        {/if}
      </button>
    </div>
  </div>
</header>

{#if mobileMenuOpen}
  <div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" role="presentation" on:click={() => (mobileMenuOpen = false)}></div>
  <nav class="fixed inset-x-3 top-20 z-50 rounded-2xl border border-black/15 bg-background/90 p-3 shadow-panel backdrop-blur-xl dark:border-white/15 md:hidden" aria-label="Mobile navigation">
    {#each navItems as item}
      <a
        href={item.href}
        class={`mb-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-all ${
          isActivePath(item.href)
            ? "bg-primary/20 text-foreground"
            : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
        }`}
        on:click={() => (mobileMenuOpen = false)}
      >
        <span class="flex items-center gap-2">
          <svelte:component this={item.icon} class="size-4" />
          {item.label}
        </span>
        <span class="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/80">{item.shortLabel}</span>
      </a>
    {/each}

  </nav>
{/if}