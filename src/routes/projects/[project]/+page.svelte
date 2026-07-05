<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import * as Card from "$lib/components/ui/card/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { pageTitle } from "$lib/stores/title";
  import { normalizeProject, projectHeroImagePath, projectImagePath } from "$lib/utils/projects";
  import type { Project, RawProject } from "$lib/types/project";
  import { ArrowLeft, ArrowRight, ExternalLink, Github, Globe, Maximize2 } from "@lucide/svelte";

  let projectData: Project | null = null;
  let isLoading = true;
  let modalOpen = false;
  let activeImageIndex = 0;

  $: gallery = projectData ? projectData.gallery : [];
  $: activeImage = projectData && gallery.length > 0 ? gallery[activeImageIndex] : null;
  $: if (projectData) {
    pageTitle.set(projectData.title);
  }

  function setActiveImage(index: number) {
    if (!projectData || gallery.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, gallery.length - 1));
    activeImageIndex = safeIndex;
  }

  function showNextImage() {
    if (!projectData || gallery.length === 0) return;
    activeImageIndex = (activeImageIndex + 1) % gallery.length;
  }

  function showPrevImage() {
    if (!projectData || gallery.length === 0) return;
    activeImageIndex = (activeImageIndex - 1 + gallery.length) % gallery.length;
  }

  function openImageModal(index: number) {
    setActiveImage(index);
    modalOpen = true;
  }

  function closeImageModal() {
    modalOpen = false;
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    if (!modalOpen) return;

    if (event.key === "Escape") {
      closeImageModal();
    } else if (event.key === "ArrowRight") {
      showNextImage();
    } else if (event.key === "ArrowLeft") {
      showPrevImage();
    }
  }

  function linkIcon(label: string) {
    const normalized = label.toLowerCase();
    if (normalized.includes("github")) return Github;
    if (normalized.includes("live") || normalized.includes("demo") || normalized.includes("open")) return Globe;
    return ExternalLink;
  }

  onMount(async () => {
    const slug = get(page).params.project;

    try {
      const response = await fetch("/data/projects.json");
      const rawProjects: RawProject[] = await response.json();
      const normalizedProjects = rawProjects.map(normalizeProject);
      const selectedProject = normalizedProjects.find((project) => project.url === slug) ?? null;
      projectData = selectedProject;

      if (selectedProject) {
        const initialIndex = Math.max(0, selectedProject.gallery.findIndex((img) => img === selectedProject.heroImage));
        activeImageIndex = initialIndex;
      }
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:window on:keydown={handleGlobalKeydown} />

{#if isLoading}
  <div class="surface-panel border-black/10 px-6 py-12 text-center text-sm text-muted-foreground dark:border-white/10">
    Loading project...
  </div>
{:else if !projectData}
  <div class="surface-panel border-black/10 px-6 py-12 text-center dark:border-white/10">
    <h1 class="text-xl font-semibold">Project not found</h1>
    <p class="mt-2 text-sm text-muted-foreground">This project may have been renamed or removed.</p>
    <Button href="/projects" class="mt-4">Back to projects</Button>
  </div>
{:else}
  <article class="space-y-6">
    <header class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card.Root class="surface-panel border-black/10 overflow-hidden dark:border-white/10">
        <div class="group relative aspect-[16/10] overflow-hidden bg-black/30">
          <img
            src={projectHeroImagePath(projectData)}
            alt={projectData.title}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
          <button
            type="button"
            class="absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/65"
            aria-label="Open full-screen gallery"
            on:click={() => openImageModal(activeImageIndex)}
          >
            <Maximize2 class="size-4" />
          </button>
        </div>

        <Card.Content class="space-y-4 p-5">
          <div class="space-y-2">
            <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{projectData.title}</h1>
            <p class="text-sm text-muted-foreground sm:text-base">{projectData.description}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            {#each projectData.badges as badge}
              <Badge variant="outline" class="rounded-full text-[11px]">{badge.label}</Badge>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>

      <div class="space-y-4">
        <Card.Root class="surface-panel border-black/10 dark:border-white/10">
          <Card.Header class="space-y-1">
            <Card.Title class="text-lg">Project details</Card.Title>
            <Card.Description>Context and quick metadata.</Card.Description>
          </Card.Header>
          <Card.Content class="space-y-3 text-sm">
            <div class="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <span class="text-muted-foreground">Role</span>
              <span>{projectData.role}</span>
            </div>
            <div class="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <span class="text-muted-foreground">Status</span>
              <span>{projectData.status}</span>
            </div>
            <div class="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <span class="text-muted-foreground">Year</span>
              <span>{projectData.year}</span>
            </div>
          </Card.Content>
        </Card.Root>

        {#if projectData.links.length > 0}
          <Card.Root class="surface-panel border-black/10 dark:border-white/10">
            <Card.Header class="space-y-1">
              <Card.Title class="text-lg">Links</Card.Title>
              <Card.Description>Repository and live resources.</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-2">
              {#each projectData.links as link}
                <Button
                  variant="secondary"
                  class="w-full justify-between"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="inline-flex items-center gap-2">
                    <svelte:component this={linkIcon(link.label)} class="size-4" />
                    {link.label}
                  </span>
                  <ExternalLink class="size-4" />
                </Button>
              {/each}
            </Card.Content>
          </Card.Root>
        {/if}
      </div>
    </header>

    {#if gallery.length > 0}
      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header class="flex flex-row items-center justify-between space-y-0">
          <div>
            <Card.Title class="text-lg">Gallery</Card.Title>
            <Card.Description>{gallery.length} screenshots</Card.Description>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-lg border border-black/15 bg-black/[0.03] transition-colors hover:bg-black/[0.07] dark:border-white/15 dark:bg-white/[0.03] dark:hover:bg-white/[0.07]"
              on:click={showPrevImage}
              aria-label="Previous image"
            >
              <ArrowLeft class="size-4" />
            </button>
            <button
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-lg border border-black/15 bg-black/[0.03] transition-colors hover:bg-black/[0.07] dark:border-white/15 dark:bg-white/[0.03] dark:hover:bg-white/[0.07]"
              on:click={showNextImage}
              aria-label="Next image"
            >
              <ArrowRight class="size-4" />
            </button>
          </div>
        </Card.Header>
        <Card.Content class="space-y-4">
          {#if activeImage}
            <button
              type="button"
              class="block w-full overflow-hidden rounded-xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-black/30"
              on:click={() => openImageModal(activeImageIndex)}
            >
              <img
                src={projectImagePath(projectData, activeImage)}
                alt={`${projectData.title} screenshot ${activeImageIndex + 1}`}
                class="max-h-[560px] w-full object-cover"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />
            </button>
          {/if}

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {#each gallery as image, index}
              <button
                type="button"
                class={`overflow-hidden rounded-lg border ${index === activeImageIndex ? "border-primary" : "border-black/10 dark:border-white/10"}`}
                on:click={() => setActiveImage(index)}
                aria-label={`Open image ${index + 1}`}
              >
                <img
                  src={projectImagePath(projectData, image)}
                  alt={`${projectData.title} thumbnail ${index + 1}`}
                  class="h-20 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
              </button>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>
    {/if}

    <div class="grid gap-4 lg:grid-cols-2">
      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header>
          <Card.Title class="text-lg">Overview</Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-sm leading-relaxed text-muted-foreground">{projectData.extendedDescription}</p>
        </Card.Content>
      </Card.Root>

      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header>
          <Card.Title class="text-lg">Architecture</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul class="space-y-2 text-sm text-muted-foreground">
            {#each projectData.architecture as item}
              <li class="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">{item}</li>
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header>
          <Card.Title class="text-lg">Features</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul class="space-y-2 text-sm text-muted-foreground">
            {#each projectData.features as item}
              <li class="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">{item}</li>
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>

      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header>
          <Card.Title class="text-lg">Timeline</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-3">
          {#each projectData.timeline as item}
            <div class="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div class="flex items-center justify-between gap-3">
                <span class="font-medium">{item.phase}</span>
                <span class="text-xs text-muted-foreground">{item.period}</span>
              </div>
              {#if item.details}
                <p class="mt-1 text-muted-foreground">{item.details}</p>
              {/if}
            </div>
          {/each}
        </Card.Content>
      </Card.Root>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header>
          <Card.Title class="text-lg">Challenges</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul class="space-y-2 text-sm text-muted-foreground">
            {#each projectData.challenges as item}
              <li class="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">{item}</li>
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>

      <Card.Root class="surface-panel border-black/10 dark:border-white/10">
        <Card.Header>
          <Card.Title class="text-lg">Lessons learned</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul class="space-y-2 text-sm text-muted-foreground">
            {#each projectData.lessonsLearned as item}
              <li class="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">{item}</li>
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>
    </div>
  </article>

  {#if modalOpen && activeImage}
    <div
      class="fixed inset-0 z-[80] bg-black/85 p-3 backdrop-blur-sm"
      role="dialog"
      tabindex="0"
      aria-modal="true"
      aria-label="Project image viewer"
      on:click={closeImageModal}
      on:keydown={(event) => {
        if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          closeImageModal();
        }
      }}
    >
      <div class="mx-auto flex h-full max-w-7xl items-center justify-center" role="presentation" on:click|stopPropagation>
        <img
          src={projectImagePath(projectData, activeImage)}
          alt={`${projectData.title} full-size screenshot ${activeImageIndex + 1}`}
          class="max-h-[90vh] w-auto max-w-full rounded-xl border border-white/10 object-contain"
          decoding="async"
        />
      </div>

      <button
        type="button"
        class="absolute left-4 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white hover:bg-black/65"
        aria-label="Previous image"
        on:click|stopPropagation={showPrevImage}
      >
        <ArrowLeft class="size-4" />
      </button>

      <button
        type="button"
        class="absolute right-4 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white hover:bg-black/65"
        aria-label="Next image"
        on:click|stopPropagation={showNextImage}
      >
        <ArrowRight class="size-4" />
      </button>

      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs text-white">
        {activeImageIndex + 1} / {gallery.length}
      </div>
    </div>
  {/if}
{/if}
