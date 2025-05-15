<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import * as Card from "$lib/components/ui/card/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import Navbar from "$lib/components/custom/Navbar.svelte";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";


  let projectData: any = null;
  let isLoading = true;

  onMount(async () => {
    const { project } = get(page).params;
    const res = await fetch('/projects.json');
    const projects = await res.json();
    projectData = projects.find((p) => p.url === project);
    isLoading = false;
  });
</script>

<Navbar />

{#if isLoading}
  <div class="flex justify-center items-center min-h-[40vh]">
    <span>Loading...</span>
  </div>
{:else if projectData}
  <div class="flex flex-col lg:flex-row justify-center items-center min-h-[60vh] gap-16 p-4">
    <!-- Carousel Section -->
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
    <!-- Info Section -->
    <div class="flex-1 flex flex-col justify-center items-start w-full max-w-xl">
      <Card.Root class="w-full bg-transparent shadow-none">
        <Card.Header class="space-y-4 text-left">
          <Card.Title class="text-3xl">{projectData.title}</Card.Title>
          <Card.Description class="text-lg text-muted-foreground">
            {projectData.description}
          </Card.Description>
          <div class="flex flex-wrap gap-2">
            {#each projectData.badges as badge}
              <Badge variant="secondary">{badge.label}</Badge>
            {/each}
          </div>
        </Card.Header>
        <Card.Content>
          {projectData.extended_description}
        </Card.Content>
        <Card.Content class="w-full mt-1">
          {#if projectData.links && projectData.links.length > 0}
            <Button
              variant="outline"
              class="w-full text-lg py-4"
              href={projectData.links[0].url}
              target="_blank"
            > Open Repository
              <!-- {projectData.links[0].label} -->
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