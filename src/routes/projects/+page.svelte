<script lang="ts">
  
  import * as Card from "$lib/components/ui/card/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { onMount } from "svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Github from "@lucide/svelte/icons/github";

  import { pageTitle } from "$lib/stores/title";
  pageTitle.set("My projects")

  interface Project {
    title: string;
    description: string;
    image: string;
    links: { label: string; url: string }[];
    badges: { label: string }[];
    url: string;
  }

  let projects: Project[] = [];
  let isLoading = true;

  onMount(async () => {
    const response = await fetch("/projects.json");
    projects = await response.json();
    isLoading = false;
  });
</script>



<div class="flex flex-wrap justify-center gap-4 px-4 md:px-12 lg:px-32 py-8 text-center">
  {#if isLoading}
    {#each Array(6) as _}
      <Card.Root class="shadow-md rounded-lg flex flex-col h-full transition-transform duration-200 hover:scale-[1.03] w-full max-w-md mx-auto">
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
    
    {#each projects as project}
      <Card.Root class="shadow-lg rounded-xl flex flex-col h-full transition-transform duration-200 hover:scale-[1.03] w-[340px] bg-white/10 backdrop-blur-2xl border border-white/20 text-white mx-2 my-2">
        <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center p-4 pb-2">
          <div class="w-full aspect-video rounded-lg overflow-hidden bg-neutral-900 flex items-center justify-center mb-1">
            <img
              src={`/img/projects/${project.url}/${project.image}`}
              alt={project.title}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <Card.Title class="text-xl font-bold tracking-tight mb-0">{project.title}</Card.Title>
          <Card.Description class="text-sm text-neutral-200 min-h-[2.2rem] flex items-center justify-center">
            {project.description}
          </Card.Description>
        </Card.Header>

        <Card.Content class="px-4 pb-4">
          <div class="flex flex-wrap gap-2 justify-center">
            {#each project.badges as badge}
              <Badge variant="outline">{badge.label}</Badge>
            {/each}
          </div>
        </Card.Content>

        <Card.Footer class="mt-auto px-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            class="flex-1 min-w-[120px]"
            href={`/projects/${project.url}`}
          >
            <ExternalLink class="w-4 h-4 mr-1" />
            Open
          </Button>
          {#each project.links as link}
            <Button
              variant="ghost"
              class="flex-1 min-w-[120px]"
              onclick={() => window.open(link.url, "_blank")}
            >
              <Github class="w-4 h-4 mr-1" />
              GitHub
            </Button>
          {/each}
        </Card.Footer>
      </Card.Root>
    {/each}
  {/if}
</div>