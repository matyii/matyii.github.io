<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import ThemeToggler from "$lib/components/custom/ThemeToggler.svelte";
</script>

<div class="flex items-center justify-center min-h-screen">
  <Card.Root class="w-full max-w-sm">
    <Card.Header class="flex flex-col items-center justify-center space-y-2">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/matyii.png" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Card.Title>@matyii</Card.Title>
      <Card.Description>Developer</Card.Description>
    </Card.Header>

    <Card.Content class="flex justify-center">
      <ThemeToggler />
    </Card.Content>
  </Card.Root>
</div>
