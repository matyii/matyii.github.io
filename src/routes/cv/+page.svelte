<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { onMount } from "svelte";
  import { generateCVPDF } from "$lib/utils/generateCVPDF";
  let cvData: any = null;
  let loading = true;
  let error: Error | null = null;


  function handleDownloadPDF() {
    generateCVPDF(cvData);
  }

  onMount(async () => {
    try {
      const res = await fetch("/data/cv-data.json");
      if (!res.ok) throw new Error("Failed to fetch CV data");
      cvData = await res.json();
    } catch (e) {
      error = e as Error;
    } finally {
      loading = false;
    }
  });
</script>

<div class="flex flex-col items-center min-h-screen px-2 py-16 bg-transparent">
  {#if loading}
    <div class="text-neutral-400">Loading CV...</div>
  {:else if error}
    <div class="text-red-400">{error.message}</div>
  {:else if cvData}
    <Card.Root class="bg-white/5 border border-white/20 rounded-2xl text-white shadow-md w-full max-w-lg py-4 px-0">
      <div class="px-6 pt-1 flex flex-col items-center">
        <Avatar.Root class="my-6 hover:scale-110 transition-all size-28 border-4 border-white/40 hover:border-indigo-300/80">
          <Avatar.Image src={cvData.avatar} alt="me" />
          <Avatar.Fallback>MK</Avatar.Fallback>
        </Avatar.Root>
        <div class="text-3xl font-bold tracking-tight">{cvData.name}</div>
        <div class="text-base text-neutral-400 mt-1">{cvData.birth}</div>
      </div>
      <div class="px-6 pb-6">
        {#each cvData.categories as category, i}
          <div class="my-3 {i === cvData.categories.length - 1 ? 'mb-6 mt-3' : ''}">
            <div class="font-semibold text-neutral-100 mb-1 text-lg">{category.title}</div>
            <div class="flex flex-col gap-y-1 text-sm text-neutral-300">
              {#each category.items as item}
                  {#if typeof item === 'string'}
                    <div>{item}</div>
                  {:else if item.label && item.value}
                    <div><span class="font-medium text-neutral-100">{item.label}:</span> {item.value}</div>
                  {:else if item.label && item.level}
                    <div><span class="font-medium text-neutral-100">{item.label}:</span> <span class="text-neutral-400">{item.level}</span></div>
                  {:else if category.title === 'Job Experience' && item.company && item.position}
                    <div class="flex flex-col py-2 border-b border-white/10 last:border-none">
                      <span class="font-medium text-neutral-100">{item.position}</span>
                      <span class="text-neutral-300">{item.company}</span>
                      <span class="text-xs text-neutral-400">
                        {item.from} – {item.current ? 'Present' : item.to}
                      </span>
                      {#if item.technologies}
                        <span class="text-xs text-neutral-400">{item.technologies}</span>
                      {/if}
                    </div>
                  {:else}
                    <div>{JSON.stringify(item)}</div>
                  {/if}
              {/each}
            </div>
          </div>
          {#if i < cvData.categories.length - 1}
            <div class="border-t border-white/10 my-4"></div>
          {/if}
        {/each}
      </div>
      <div class="px-6 pb-3 flex flex-col items-center gap-2">
        <Button onclick={handleDownloadPDF} variant="default" class="w-full max-w-xs text-base py-3">
          Download CV (PDF)
        </Button>
        <div class="text-xs text-muted-foreground mt-1">Last updated: 25.7.2025</div>
      </div>
    </Card.Root>
  {/if}
</div>