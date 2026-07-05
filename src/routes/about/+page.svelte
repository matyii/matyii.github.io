<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { pageTitle } from "$lib/stores/title";
    import { onMount } from "svelte";
    import { ExternalLink, Monitor } from "@lucide/svelte";

    pageTitle.set("Setup");

    type RawSetupItem = {
      type?: string;
      device?: string;
      specs?: string;
      category?: string;
      name?: string;
      description?: string;
      whyIUseIt?: string;
      links?: { label: string; url: string }[];
      image?: string;
      order?: number;
    };

    type SetupItem = {
      category: string;
      name: string;
      description: string;
      whyIUseIt: string;
      links: { label: string; url: string }[];
      image?: string;
      order: number;
    };

    let setupData: SetupItem[] = [];
    let loading = true;
    let error = "";

    const categoryOrder = [
      "Desk",
      "Displays",
      "Keyboard",
      "Mouse",
      "Audio",
      "Network",
      "Homelab",
      "Development",
      "Productivity",
      "Software",
      "General"
    ];

    function normalizeItem(item: RawSetupItem): SetupItem {
      return {
        category: item.category ?? item.type ?? "General",
        name: item.name ?? item.device ?? "Unknown item",
        description: item.description ?? item.specs ?? "No description available.",
        whyIUseIt: item.whyIUseIt ?? "Reliable in my daily workflow.",
        links: item.links ?? [],
        image: item.image,
        order: item.order ?? 999
      };
    }

    onMount(async () => {
      try {
        const res = await fetch("/data/desktop_setup.json");
        if (!res.ok) throw new Error("Failed to fetch setup data");
        const rawData: RawSetupItem[] = await res.json();
        setupData = rawData.map(normalizeItem);
      } catch (e) {
        error = (e instanceof Error ? e.message : String(e)) || "Unknown error";
      } finally {
        loading = false;
      }
    });

    $: groupedItems = setupData.reduce<Record<string, SetupItem[]>>((acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    $: categories = Object.entries(groupedItems)
      .map(([category, items]) => [
        category,
        [...items].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      ] as [string, SetupItem[]])
      .sort(([a], [b]) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
</script>
<section class="space-y-6">
  <Card.Root class="surface-panel border-black/10 p-6 md:p-8 dark:border-white/10">
    <Card.Content class="grid gap-6 p-0 md:grid-cols-[1.2fr_0.8fr] md:items-center">
      <div class="space-y-4">
        <Badge variant="outline" class="rounded-full border-black/20 bg-black/5 px-3 py-1 dark:border-white/20 dark:bg-white/5">Developer setup and workflow</Badge>
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Workspace, tools, and daily driver stack.</h1>
        <p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
          A practical setup optimized for coding, systems work, and long deep-focus sessions.
          Each item includes what it is and why it stays in my workflow.
        </p>
      </div>
      <div class="rounded-2xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-black/30">
        <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Monitor class="size-4" />
          Setup profile
        </div>
        <p class="text-sm">Balanced between performance, comfort, and reliability for day-to-day engineering work.</p>
        <Button href="mailto:matyas@matyas.services" class="mt-4 w-full">Business enquiries</Button>
      </div>
    </Card.Content>
  </Card.Root>

  {#if loading}
    <div class="surface-panel border-black/10 px-6 py-10 text-center text-sm text-muted-foreground dark:border-white/10">Loading setup...</div>
  {:else if error}
    <div class="surface-panel border-destructive/40 px-6 py-10 text-center text-sm text-destructive">{error}</div>
  {:else}
    {#each categories as [category, items]}
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold tracking-tight">{category}</h2>
          <Badge variant="secondary" class="rounded-full">{items.length} items</Badge>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {#each items as item}
            <Card.Root class="surface-panel border-black/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-white/10">
              <Card.Content class="space-y-3 p-0">
                <div class="space-y-1">
                  <h3 class="text-base font-semibold tracking-tight">{item.name}</h3>
                  <p class="text-sm text-muted-foreground">{item.description}</p>
                </div>

                {#if item.image}
                  <div class="overflow-hidden rounded-xl border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04]">
                    <img src={item.image} alt={item.name} class="h-40 w-full object-cover" loading="lazy" />
                  </div>
                {/if}

                <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/[0.03]">
                  <span class="font-medium text-foreground">Why I use it:</span>
                  <span> {item.whyIUseIt}</span>
                </div>

                {#if item.links.length > 0}
                  <div class="flex flex-wrap gap-2">
                    {#each item.links as link}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground dark:border-white/10"
                      >
                        {link.label}
                        <ExternalLink class="size-3" />
                      </a>
                    {/each}
                  </div>
                {/if}
              </Card.Content>
            </Card.Root>
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</section>