<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import * as Card from "$lib/components/ui/card/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import Github from "@lucide/svelte/icons/github";
  import { pageTitle } from "$lib/stores/title";
  import Maximize2 from '@lucide/svelte/icons/maximize-2';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { fade } from 'svelte/transition';

  type Project = {
    url: string;
    title: string;
    description: string;
    extended_description?: string;
    images: string[];
    badges: { label: string }[];
    links?: { url: string; label?: string }[];
    [key: string]: any;
  };

  let projectData: Project | null = null;
  let isLoading = true;
  let modalOpen = false;
  let modalImg: string | null = null;
  let modalDiv: HTMLDivElement | null = null;
  $: if (modalOpen && modalDiv) {
    modalDiv.focus();
  }

  function showNextImage() {
    if (!projectData || !modalImg) return;
    const idx = projectData && projectData.images
      ? projectData.images.findIndex(img => `/img/projects/${projectData.url}/${img}` === modalImg)
      : -1;
    if (idx < projectData.images.length - 1) {
      modalImg = `/img/projects/${projectData.url}/${projectData.images[idx + 1]}`;
    }
  }
  function showPrevImage() {
    if (!projectData || !modalImg) return;
    const idx = projectData.images.findIndex(img => `/img/projects/${projectData.url}/${img}` === modalImg);
    if (idx > 0) {
      modalImg = `/img/projects/${projectData.url}/${projectData.images[idx - 1]}`;
    }
  }

  onMount(() => {
    let isMounted = true;

    (async () => {
      const { project } = get(page).params;
      const res = await fetch('/data/projects.json');
      const projects: Project[] = await res.json();
      if (isMounted) {
        projectData = projects.find((p: Project) => p.url === project) || null;
        isLoading = false;
        if (projectData) {
          pageTitle.set(projectData.title);
        }
      }
    })();

    // Arrow key navigation for carousel (when modal not open)
    const handleKeydown = (e: KeyboardEvent) => {
      if (modalOpen) return;
      const key = e.key || e.code;
      if (key === 'ArrowRight') {
        const nextBtn = document.querySelector('.carousel-next-btn');
        if (nextBtn) (nextBtn as HTMLElement).click();
      } else if (key === 'ArrowLeft') {
        const prevBtn = document.querySelector('.carousel-prev-btn');
        if (prevBtn) (prevBtn as HTMLElement).click();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>



{#if isLoading}
  <div class="flex justify-center items-center min-h-[40vh] animate-pulse">
    <span>Loading...</span>
  </div>
{:else if projectData}
  <div class="flex flex-col justify-center items-center min-h-[60vh] mt-6 p-4">
    
  <div class="w-full max-w-3xl flex-1" role="group">
    <Carousel.Root>
      <Carousel.Content>
        {#each projectData.images as img, idx}
          <Carousel.Item>
            <div class="aspect-w-16 aspect-h-9 w-full h-[420px] rounded-2xl overflow-hidden bg-muted relative flex flex-col items-center justify-center">
              <img
                src={`/img/projects/${projectData.url}/${img}`}
                alt={projectData.title}
                class="w-full h-full object-cover rounded-xl shadow-2xl"
              />
              <button
                type="button"
                class="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all"
                aria-label="Open full screen"
                on:click={() => {
                  if (projectData) {
                    modalOpen = true;
                    modalImg = `/img/projects/${projectData.url}/${img}`;
                  }
                }}
              >
                <Maximize2 size={22} />
              </button>
              <div class="mt-2 flex items-center justify-center gap-2 text-md font-bold text-white bg-black/40 rounded-full px-3 py-1 absolute left-1/2 -translate-x-1/2 bottom-3">
                <span>{idx + 1} / {projectData.images.length}</span>
              </div>
            </div>
          </Carousel.Item>
        {/each}
      </Carousel.Content>
      <div class="flex justify-between mt-4">
        <Carousel.Previous class="btn btn-outline carousel-prev-btn" />
        <Carousel.Next class="btn btn-outline carousel-next-btn" />
      </div>
    </Carousel.Root>
  </div>
    <Separator orientation="vertical" class='mx-3'/>
    
    <div class="flex-1 flex flex-col justify-center items-start w-full max-w-md text-center">
      <Card.Root class="w-full bg-white/10 backdrop-blur-2xl border border-white/30 rounded-lg text-white shadow-md">
        <Card.Header class="space-y-4">
          <Card.Title class="text-4xl text-neutral-100">{projectData.title}</Card.Title>
          <Card.Description class="text-lg text-neutral-200">
            {projectData.description}
          </Card.Description>
          <div class="flex flex-wrap gap-2 justify-center">
            {#each projectData.badges as badge}
              <Badge>{badge.label}</Badge>
            {/each}
          </div>
        </Card.Header>
        <Card.Content class="text-neutral-100">
          {projectData.extended_description}
        </Card.Content>
        <Card.Content class="w-full mt-1">
          {#if projectData.links && projectData.links.length > 0}
            <div class="flex flex-col gap-2 w-full">
              {#each projectData.links as link}
                <Button
                  variant="outline"
                  class="w-full text-md py-4 flex items-center justify-center gap-2"
                  href={link.url}
                  target="_blank"
                >
                  {#if link.label?.toLowerCase().includes('github')}
                    <Github />
                  {/if}
                  {link.label || 'Open'}
                </Button>
              {/each}
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
    {#if modalOpen && modalImg}
      <div
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 focus:outline-none"
        role="dialog"
        tabindex="0"
        aria-modal="true"
        on:click={() => { modalOpen = false; modalImg = null; }}
        bind:this={modalDiv}
        on:keydown={(e) => {
          const key = e.key || e.code;
          if (key === 'Escape' || key === 'Esc') {
            modalOpen = false;
            modalImg = null;
          } else if (key === 'ArrowRight') {
            showNextImage();
          } else if (key === 'ArrowLeft') {
            showPrevImage();
          }
        }}
      >
        <div class="relative flex items-center justify-center w-full" role="presentation" aria-label="Modal image container">
          <button
            type="button"
            class="focus:outline-none p-0 m-0 bg-transparent border-none"
            aria-label="Close modal"
            tabindex="0"
            on:click|stopPropagation
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            style="display: flex;"
          >
            <img src={modalImg} alt="Full size" class="w-[75vw] h-[75vh] object-contain shadow-2xl" in:fade={{ duration: 120 }} out:fade={{ duration: 120 }} />
          </button>
        </div>
        {#if projectData}
          <div class="mt-4 flex items-center gap-4 text-lg font-bold text-white justify-center">
            {#if projectData.images.findIndex(img => `/img/projects/${projectData.url}/${img}` === modalImg) > 0}
              <button
                type="button"
                aria-label="Previous image"
                class="size-8 touch-manipulation rounded-full bg-white/10 border border-white/30 text-white shadow-lg flex items-center justify-center hover:bg-white/20"
                on:click={(e) => { e.stopPropagation(); showPrevImage(); }}
              >
                <ArrowLeft class="size-4" />
                <span class="sr-only">Previous slide</span>
              </button>
            {/if}
            <span>
              {(() => {
                const idx = projectData.images.findIndex(img => `/img/projects/${projectData.url}/${img}` === modalImg);
                return `${idx + 1} / ${projectData.images.length}`;
              })()}
            </span>
            {#if projectData.images.findIndex(img => `/img/projects/${projectData.url}/${img}` === modalImg) < projectData.images.length - 1}
              <button
                type="button"
                aria-label="Next image"
                class="size-8 touch-manipulation rounded-full bg-white/10 border border-white/30 text-white shadow-lg flex items-center justify-center hover:bg-white/20"
                on:click={(e) => { e.stopPropagation(); showNextImage(); }}
              >
                <ArrowRight class="size-4" />
                <span class="sr-only">Next slide</span>
              </button>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{:else}
  <div class="flex justify-center items-center min-h-[40vh]">
    <span>Project not found.</span>
  </div>
{/if}