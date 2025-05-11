<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import Navbar from "$lib/components/custom/Navbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
</script>
<Navbar />
<div class="flex items-center justify-center min-h-screen">
  <Card.Root class="w-full max-w-sm">
    <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/matyii.png" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Card.Title>itsmatyii</Card.Title>
      <Card.Description>i'm lajos</Card.Description>
  </Card.Header>

    <Card.Content class="flex justify-center gap-2">
      <!-- <Button href="https://github.com/matyii" target="_blank">my github</Button> -->
    </Card.Content>
  </Card.Root>
</div>