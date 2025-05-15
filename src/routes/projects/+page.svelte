<script lang="ts">
  import Navbar from "$lib/components/custom/Navbar.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { onMount } from "svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Github from "@lucide/svelte/icons/github";

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
    isLoading = false; // Set loading to false once data is fetched
  });
</script>

<Navbar />

<div class="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3 text-center">
  {#if isLoading}
    <!-- Skeleton Loader -->
    {#each Array(6) as _}
      <Card.Root class="shadow-md rounded-lg flex flex-col h-full">
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
    <!-- Render Projects -->
    {#each projects as project}
      <Card.Root class="shadow-md rounded-lg flex flex-col h-full">
        <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center p-4">
          <img
            src={`/img/projects/${project.url}/${project.image}`}
            alt={project.title}
            class="w-full h-48 object-cover rounded-lg shadow-lg"
          />
          <Card.Title class="text-lg font-bold">{project.title}</Card.Title>
          <Card.Description class="text-sm text-muted-foreground">
            {project.description}
          </Card.Description>
        </Card.Header>

        <Card.Content class="p-4 flex-grow">
          <div class="flex flex-wrap gap-2 justify-center">
            {#each project.badges as badge}
              <Badge variant="secondary">{badge.label}</Badge>
            {/each}
          </div>
        </Card.Content>

        <Card.Footer class="mt-auto p-5 flex sm:flex-row flex-col gap-2">
          <Button
            variant="outline"
            class="w-full"
            href={`/projects/${project.url}`}
          >
            <ExternalLink />
            Open
          </Button>
          {#each project.links as link}
            <Button
              variant="outline"
              class="w-full"
              onclick={() => window.open(link.url, "_blank")}
            >
              <Github />
              GitHub Repository
            </Button>
          {/each}
        </Card.Footer>
      </Card.Root>
    {/each}
  {/if}
</div>