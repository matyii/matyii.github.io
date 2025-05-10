<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import Navbar from "$lib/components/custom/Navbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>
<Navbar />
<div class="flex items-center justify-center min-h-screen">
  <Card.Root class="w-full max-w-sm">
    <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/matyii.png" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Card.Title>hi there.</Card.Title>
      <Card.Description>i'm 
      <HoverCard.Root>
      <HoverCard.Trigger
        href="https://github.com/sveltejs"
        target="_blank"
        rel="noreferrer noopener"
        class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black">matyii
      </HoverCard.Trigger>
      <HoverCard.Content class="">
        <div class="flex justify-between space-x-4">
          <Avatar.Root>
            <Avatar.Image src="https://github.com/matyii.png" />
            <Avatar.Fallback>MK</Avatar.Fallback>
          </Avatar.Root>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">@matyii</h4>
            <p class="text-sm text-muted-foreground">20 year old it technician</p>
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>  
    , a 20-year old IT technician, hobbyist programmer, server administrator</Card.Description>
  </Card.Header>

    <Card.Content class="flex justify-center gap-2">
      <!-- <Button href="https://github.com/matyii" target="_blank">my github</Button> -->
    </Card.Content>
  </Card.Root>
</div>