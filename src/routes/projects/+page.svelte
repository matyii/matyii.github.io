<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import { Search } from "@lucide/svelte";
  import { motionPreference } from "$lib/stores/motion";
  import { MOTION, motionDelay, motionDuration, motionOffset } from "$lib/utils/animation";
  import { normalizeProject } from "$lib/utils/projects";
  import type { Project, RawProject } from "$lib/types/project";

  import { pageTitle } from "$lib/stores/title";
  pageTitle.set("Projects");

  let projects: Project[] = [];
  let isLoading = true;
  let searchTerm = "";
  let activeTag = "All";

  $: reducedMotion = $motionPreference === "reduced";

  onMount(async () => {
    const response = await fetch("/data/projects.json");
    const rawProjects: RawProject[] = await response.json();
    projects = rawProjects.map(normalizeProject);
    isLoading = false;
  });

  $: allTags = [
    "All",
    ...Array.from(new Set(projects.flatMap((project) => project.badges.map((badge) => badge.label)))).sort()
  ];

  $: filteredProjects = projects.filter((project) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      project.title.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search) ||
      project.badges.some((badge) => badge.label.toLowerCase().includes(search));

    const matchesTag = activeTag === "All" || project.badges.some((badge) => badge.label === activeTag);

    return matchesSearch && matchesTag;
  });
</script>

<section class="motion-enter space-y-6">
  <header class="motion-enter motion-enter-delay-1 space-y-3">
    <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
    <p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
      A curated list of products and experiments with strong engineering focus and polished execution.
    </p>
  </header>

  <div class="motion-enter motion-enter-delay-1 surface-panel border-white/10 p-4">
    <div class="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3">
      <Search class="size-4 text-muted-foreground" />
      <input
        bind:value={searchTerm}
        placeholder="Search projects, stacks, technologies"
        class="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>

    <div class="flex flex-wrap gap-2">
      {#each allTags as tag}
        <Button
          variant={activeTag === tag ? "default" : "secondary"}
          size="sm"
          class="rounded-full"
          onclick={() => (activeTag = tag)}
        >
          {tag}
        </Button>
      {/each}
    </div>
  </div>

  <div class="motion-enter motion-enter-delay-2 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  {#if isLoading}
    {#each Array(6) as _}
      <Card.Root class="surface-panel border-white/10">
        <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center p-4">
          <Skeleton class="w-full h-48 rounded-lg" />
          <Skeleton class="h-[20px] w-[150px] rounded-full" />
          <Skeleton class="h-[16px] w-[200px] rounded-full" />
        </Card.Header>

        <Card.Content class="p-4 flex-grow">
          <div class="flex flex-wrap gap-2 justify-center">
            <Skeleton class="h-[20px] w-[80px] rounded-full" />
            <Skeleton class="h-[20px] w-[80px] rounded-full" />
          </div>
        </Card.Content>

        <Card.Footer class="mt-auto p-0">
          <Skeleton class="h-[40px] w-full rounded-none" />
        </Card.Footer>
      </Card.Root>
    {/each}
  {:else}

    {#if filteredProjects.length === 0}
      <div class="surface-panel col-span-full border-white/10 px-6 py-10 text-center">
        <h2 class="text-lg font-semibold">No projects found</h2>
        <p class="mt-2 text-sm text-muted-foreground">Try a different search term or clear the active tag filter.</p>
        <Button variant="secondary" class="mt-4" onclick={() => {
          searchTerm = "";
          activeTag = "All";
        }}>
          Reset filters
        </Button>
      </div>
    {:else}
      {#key `${activeTag}:${searchTerm.trim().toLowerCase()}`}
      {#each filteredProjects as project, index}
      <a
        href={`/projects/${project.url}`}
        class="group surface-panel flex h-full min-h-[420px] flex-col overflow-hidden border-white/10 transition-all duration-base ease-standard hover:-translate-y-1 hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-primary/60 motion-reduce:transition-none"
        tabindex="0"
        in:fly={{
          y: motionOffset(MOTION.distance.cardY, reducedMotion),
          duration: motionDuration(MOTION.duration.base, reducedMotion),
          delay: motionDelay(index, MOTION.stagger.tight, reducedMotion),
          easing: cubicOut
        }}
      >
        <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center p-4 pb-2">
          <div class="w-full aspect-video rounded-lg overflow-hidden bg-neutral-900 flex items-center justify-center mb-1">
            <img
              src={`/img/projects/${project.url}/${project.heroImage}`}
              alt={project.title}
              class="w-full h-full object-cover transition-transform duration-medium ease-standard group-hover:scale-[1.04] motion-reduce:transition-none"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
            />
          </div>
          <Card.Title class="text-xl font-bold tracking-tight mb-0">{project.title}</Card.Title>
          <Card.Description class="text-sm text-muted-foreground dark:text-neutral-300 min-h-[2.2rem] flex items-center justify-center">
            {project.description}
          </Card.Description>
        </Card.Header>

        <Card.Content class="px-4 pb-4 mt-auto">
          <div class="flex flex-wrap gap-2 justify-center">
            {#each project.badges as badge}
              <Badge variant="outline" class="rounded-full text-[11px]">{badge.label}</Badge>
            {/each}
          </div>
        </Card.Content>
      </a>
      {/each}
      {/key}
    {/if}
  {/if}
</div>
</section>