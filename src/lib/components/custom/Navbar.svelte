<script lang='ts'>
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import ThemeToggler from "$lib/components/custom/ThemeToggler.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<nav class="flex items-center justify-between p-2 m-8">
  <div class="flex items-center space-x-4">
    <Avatar.Root class="size-10">
        <Avatar.Image src="https://github.com/matyii.png" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
    </Avatar.Root>
  </div>

  <div class="hidden md:flex space-x-4">
    <Button variant="ghost" href="/">Home</Button>
    <Button variant="ghost" href="/projects">My projects</Button>
    <ThemeToggler />
  </div>

  <div class="md:hidden">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost">Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="rounded shadow-md">
        <DropdownMenu.Group>
          <DropdownMenu.Item>Home</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group class='flex justify-center py-2'>
          <ThemeToggler />
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>
<div class="flex justify-center mx-8">
  <Separator />
</div>