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

  onMount(async () => {
    const { project } = get(page).params;
    const res = await fetch('/data/projects.json');
    const projects: Project[] = await res.json();
    projectData = projects.find((p: Project) => p.url === project) || null;
    isLoading = false;
    if (projectData) {
      pageTitle.set(projectData.title);
    }
  });
</script>



{#if isLoading}
  <div class="flex justify-center items-center min-h-[40vh] animate-pulse">
    <span>Loading...</span>
  </div>
{:else if projectData}
  <div class="flex flex-col justify-center items-center min-h-[60vh] mt-6 p-4">
    
    <div class="w-full max-w-xl flex-1">
      <Carousel.Root>
        <Carousel.Content>
          {#each projectData.images as img}
            <Carousel.Item>
              <div class="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden bg-muted">
                <img
                  src={`/img/projects/${projectData.url}/${img}`}
                  alt={projectData.title}
                  class="w-full h-full object-cover rounded-xl shadow-2xl"
                />
              </div>
            </Carousel.Item>
          {/each}
        </Carousel.Content>
        <div class="flex justify-between mt-4">
          <Carousel.Previous class="btn btn-outline" />
          <Carousel.Next class="btn btn-outline" />
        </div>
      </Carousel.Root>
    </div>
    <Separator orientation="vertical" class='mx-3'/>
    
    <div class="flex-1 flex flex-col justify-center items-start w-full max-w-xl text-center">
      <Card.Root class="w-full bg-white/10 backdrop-blur-2xl border border-white/30 rounded-xl text-white shadow-md">
        <Card.Header class="space-y-4">
          <Card.Title class="text-4xl text-neutral-100">{projectData.title}</Card.Title>
          <Card.Description class="text-lg text-neutral-200">
            {projectData.description}
          </Card.Description>
          <div class="flex flex-wrap gap-2 justify-center">
            {#each projectData.badges as badge}
              <Badge variant="secondary">{badge.label}</Badge>
            {/each}
          </div>
        </Card.Header>
        <Card.Content class="text-neutral-100">
          {projectData.extended_description}
        </Card.Content>
        <Card.Content class="w-full mt-1">
          {#if projectData.links && projectData.links.length > 0}
            <Button
              variant="outline"
              class="w-full text-md py-4"
              href={projectData.links[0].url}
              target="_blank"
            > 
            <Github />
            Open Repository
              
            </Button>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center min-h-[40vh]">
    <span>Project not found.</span>
  </div>
{/if}