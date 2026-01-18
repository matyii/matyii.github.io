<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { pageTitle } from "$lib/stores/title";
    import { onMount } from "svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    pageTitle.set("About me");

    let setupData: Array<{ type: string; device: string; specs: string }> = [];
    let loading = true;
    let error = "";
    onMount(async () => {
      try {
        const res = await fetch("/data/desktop_setup.json");
        if (!res.ok) throw new Error("Failed to fetch setup data");
        setupData = await res.json();
      } catch (e) {
        error = (e instanceof Error ? e.message : String(e)) || "Unknown error";
      } finally {
        loading = false;
      }
    });
</script>
<div class="flex flex-col justify-center items-center min-h-screen px-4 mb-5">
  <div class="flex justify-center w-full max-w-screen-xl mx-auto mt-5">
    <Card.Root class="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-xl text-white shadow-lg p-6 w-full max-w-[540px]">
      <Card.Content>
        <Tabs.Root value="about">
          <div class="flex justify-center w-full">
            <Tabs.List class="inline-flex gap-3 mb-6 bg-white/10 backdrop-blur rounded-xl p-3">
              <Tabs.Trigger value="about" class="px-4 py-2 rounded-lg font-semibold transition-all data-[state=active]:bg-white/20 data-[state=active]:border-b-4 data-[state=active]:border-indigo-300 data-[state=active]:text-indigo-100 data-[state=inactive]:text-neutral-300 data-[state=inactive]:hover:bg-white/10">About</Tabs.Trigger>
              <Tabs.Trigger value="setup" class="px-4 py-2 rounded-lg font-semibold transition-all data-[state=active]:bg-white/20 data-[state=active]:border-b-4 data-[state=active]:border-indigo-300 data-[state=active]:text-indigo-100 data-[state=inactive]:text-neutral-300 data-[state=inactive]:hover:bg-white/10">Setup</Tabs.Trigger>
            </Tabs.List>
          </div>
          <Tabs.Content value="about">
            <div class="space-y-4">
              <Card.Title class="text-center">About Me</Card.Title>
              <p>Hi there! My name is Kristóf Mátyás, and I’m a 20-year-old IT technician with a passion for all things tech.</p>
              <p>I specialize in system administration and networking, though I'm always open to new challenges. I’ve worked on projects with FiveM, GitLab, UniFi, and more, and I’ve really enjoyed learning and collaborating on them.</p>
              <p>When I’m not coding or tinkering with tech, you’ll find me outside spending time with my girlfriend or cruising around with her in my car, listening to music.</p>
              <p>For business enquiries, don’t hesitate to contact me via <a href="mailto:matyas@matyas.services" class="text-info underline underline-offset-4 transition-all hover:text-blue-400">e-mail.</a></p>
              <div class="flex flex-col gap-3 mt-4">
                <Button href="mailto:matyas@matyas.services" variant="default">Business enquiries</Button>
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="setup">
            <div class="space-y-4">
              <Card.Title class="text-center">My Coding Setup</Card.Title>
              <div class="my-6 w-full overflow-y-auto">
                {#if loading}
                  <div class="text-center text-neutral-400">Loading...</div>
                {:else if error}
                  <div class="text-center text-red-400">{error}</div>
                {:else}
                  <Table.Root>
                    <Table.Caption>My coding setup details.</Table.Caption>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head class="w-[100px]">Type</Table.Head>
                        <Table.Head>Device</Table.Head>
                        <Table.Head>Specs / Details</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {#each setupData as item, i (item.type + item.device + item.specs)}
                        <Table.Row class={i < setupData.length - 1 ? 'border-b border-white/20' : ''}>
                          <Table.Cell class="font-medium">{item.type}</Table.Cell>
                          <Table.Cell>{item.device}</Table.Cell>
                          <Table.Cell>{item.specs}</Table.Cell>
                        </Table.Row>
                      {/each}
                    </Table.Body>
                  </Table.Root>
                {/if}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Card.Content>
    </Card.Root>
  </div>
</div>