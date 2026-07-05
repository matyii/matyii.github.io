<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { onMount } from "svelte";
  import { Download } from "@lucide/svelte";
  import { pageTitle } from "$lib/stores/title";

  pageTitle.set("CV");

  type CVItemString = string;
  type CVItemLabelValue = { label: string; value: string };
  type CVItemLabelLevel = { label: string; level: string };
  type CVItemJob = {
    company: string;
    position: string;
    from: string;
    to?: string;
    current?: boolean;
    technologies?: string;
  };

  type CVItem = CVItemString | CVItemLabelValue | CVItemLabelLevel | CVItemJob;

  type CVCategory = {
    title: string;
    items: CVItem[];
  };

  type CVData = {
    name: string;
    birth: string;
    avatar?: string;
    categories: CVCategory[];
  };

  let cvData: CVData | null = null;
  let loading = true;
  let downloading = false;
  let error: Error | null = null;

  function isLabelValueItem(item: CVItem): item is CVItemLabelValue {
    return typeof item === "object" && item !== null && "label" in item && "value" in item;
  }

  function isLabelLevelItem(item: CVItem): item is CVItemLabelLevel {
    return typeof item === "object" && item !== null && "label" in item && "level" in item;
  }

  function isJobItem(item: CVItem): item is CVItemJob {
    return typeof item === "object" && item !== null && "company" in item && "position" in item;
  }

  function levelToPercent(level: string) {
    const normalized = level.toLowerCase();
    if (normalized === "native") return 100;
    if (normalized === "fluent") return 88;
    if (normalized === "b2") return 78;
    if (normalized === "intermediate" || normalized === "b1") return 65;
    return 48;
  }

  function normalizeCategoryTitle(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function getCategoryByAliases(aliases: string[]): CVCategory | undefined {
    const normalizedAliases = aliases.map(normalizeCategoryTitle);
    return cvData?.categories.find((category) =>
      normalizedAliases.includes(normalizeCategoryTitle(category.title))
    );
  }

  $: languageAliases = ["Languages", "Language"];
  $: languagesCategory = getCategoryByAliases(languageAliases);
  $: workCategory = getCategoryByAliases(["Job Experience", "Work Experience", "Experience"]);
  $: stackCategory = getCategoryByAliases([
    "Software / Web Development",
    "Web Development",
    "Development Stack",
    "Core Stack",
    "Coding Tools"
  ]);
  $: featuredStack =
    stackCategory?.items
      .flatMap((item) => {
        if (typeof item === "string") return [item.trim()];
        if (isLabelValueItem(item)) return [item.value.split(",")[0]?.trim() ?? ""];
        return [];
      })
      .filter((item): item is string => Boolean(item))
      .slice(0, 6) ?? [];
  $: categoriesWithoutLanguages = (cvData?.categories ?? []).filter(
    (category) => !languageAliases.map(normalizeCategoryTitle).includes(normalizeCategoryTitle(category.title))
  );


  async function handleDownloadPDF() {
    if (!cvData || downloading) return;

    downloading = true;
    try {
      const { generateCVPDF } = await import("$lib/utils/generateCVPDF");
      await generateCVPDF(cvData);
    } finally {
      downloading = false;
    }
  }

  onMount(async () => {
    try {
      const res = await fetch("/data/cv-data.json");
      if (!res.ok) throw new Error("Failed to fetch CV data");
      cvData = await res.json() as CVData;
    } catch (e) {
      error = e as Error;
    } finally {
      loading = false;
    }
  });
</script>

<section class="space-y-6">
  {#if loading}
    <div class="surface-panel border-black/10 px-6 py-10 text-center text-sm text-muted-foreground dark:border-white/10">Loading CV...</div>
  {:else if error}
    <div class="surface-panel border-destructive/40 px-6 py-10 text-center text-sm text-destructive">{error.message}</div>
  {:else if cvData}
    <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <aside class="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <Card.Root class="surface-panel border-black/10 p-5 dark:border-white/10">
          <Card.Content class="space-y-5 p-0">
            <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar.Root class="size-24 border border-black/20 shadow-soft dark:border-white/20">
                <Avatar.Image src={cvData.avatar} alt="me" />
                <Avatar.Fallback>MK</Avatar.Fallback>
              </Avatar.Root>
              <div class="space-y-1">
                <h1 class="text-3xl font-semibold tracking-tight leading-tight">{cvData.name}</h1>
                <p class="text-sm text-muted-foreground">{cvData.birth}</p>
                <Badge variant="outline" class="rounded-full border-black/20 bg-black/[0.03] dark:border-white/20 dark:bg-white/[0.03]">
                  Open to opportunities
                </Badge>
              </div>
            </div>

            <div class="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <h2 class="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Profile</h2>
              <p class="text-sm leading-relaxed text-muted-foreground">
                Systems-minded developer focused on maintainable software, practical infrastructure,
                and stable product delivery with clear engineering standards.
              </p>
            </div>

            {#if workCategory}
              <div class="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Current Role</h3>
                <div class="space-y-2 text-sm text-muted-foreground">
                  {#each workCategory.items as item}
                    {#if isJobItem(item)}
                      <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                        <p class="font-medium text-foreground">{item.position}</p>
                        <p>{item.company}</p>
                        <p class="text-xs">{item.from} - {item.current ? "Present" : item.to}</p>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}

            {#if featuredStack.length > 0}
              <div class="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Core Tools</h3>
                <div class="flex flex-wrap gap-2">
                  {#each featuredStack as item}
                    <Badge variant="secondary" class="rounded-full">{item}</Badge>
                  {/each}
                </div>
              </div>
            {/if}

            <Button onclick={handleDownloadPDF} class="w-full rounded-xl" disabled={downloading}>
              <Download class="size-4" />
              {downloading ? "Preparing PDF..." : "Download CV (PDF)"}
            </Button>
            <p class="text-xs text-muted-foreground">Last updated: 25.7.2025</p>
          </Card.Content>
        </Card.Root>
      </aside>

      <div class="space-y-5">
        {#if languagesCategory}
          <Card.Root class="surface-panel border-black/10 p-5 dark:border-white/10">
            <Card.Header class="px-0 pt-0">
              <Card.Title class="text-lg">Language Proficiency</Card.Title>
              <Card.Description>Communication readiness for project collaboration.</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-3 px-0 pb-0">
              {#each languagesCategory.items as item}
                {#if isLabelLevelItem(item)}
                  <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="font-medium text-foreground">{item.label}</span>
                      <span class="text-xs text-muted-foreground">{item.level}</span>
                    </div>
                    <div class="h-1.5 rounded-full bg-black/10 dark:bg-white/10">
                      <div class="h-full rounded-full bg-primary" style={`width: ${levelToPercent(item.level)}%;`}></div>
                    </div>
                  </div>
                {/if}
              {/each}
            </Card.Content>
          </Card.Root>
        {/if}

        {#each categoriesWithoutLanguages as category, i}
            <section class="relative rounded-2xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.02]">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-semibold tracking-tight">{category.title}</h2>
                <Badge variant="secondary" class="rounded-full">{category.items.length}</Badge>
              </div>

              <div class="space-y-3 text-sm text-muted-foreground">
                {#each category.items as item}
                  {#if typeof item === "string"}
                    <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">{item}</div>
                  {:else if isLabelValueItem(item)}
                    <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                      <span class="font-medium text-foreground">{item.label}:</span> {item.value}
                    </div>
                  {:else if isLabelLevelItem(item)}
                    <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                      <div class="mb-1 flex items-center justify-between">
                        <span class="font-medium text-foreground">{item.label}</span>
                        <span class="text-xs">{item.level}</span>
                      </div>
                      <div class="h-1.5 rounded-full bg-black/10 dark:bg-white/10">
                        <div class="h-full rounded-full bg-primary" style={`width: ${levelToPercent(item.level)}%;`}></div>
                      </div>
                    </div>
                  {:else if isJobItem(item)}
                    <div class="rounded-xl border border-black/10 bg-black/[0.03] px-3 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <div class="font-medium text-foreground">{item.position}</div>
                      <div>{item.company}</div>
                      <div class="text-xs">{item.from} - {item.current ? "Present" : item.to}</div>
                      {#if item.technologies}
                        <div class="mt-1 text-xs">{item.technologies}</div>
                      {/if}
                    </div>
                  {/if}
                {/each}
              </div>

              {#if i < categoriesWithoutLanguages.length - 1}
                <div class="pointer-events-none absolute -bottom-3 left-6 h-3 w-px bg-black/20 dark:bg-white/20"></div>
              {/if}
            </section>
        {/each}
      </div>
    </div>
  {/if}
</section>