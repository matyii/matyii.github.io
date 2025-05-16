<script lang='ts'>
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import ThemeToggler from "$lib/components/custom/ThemeToggler.svelte";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Home, Briefcase, User } from "@lucide/svelte";
</script>

<nav class="flex items-center justify-between p-2 m-6">
  <div class="flex items-center space-x-4">
    <a href="/" aria-label="Go to main page">
    <Avatar.Root class="size-10">
        <Avatar.Image src="/favicon.jpg" alt="@matyii" />
        <Avatar.Fallback>MK</Avatar.Fallback>
    </Avatar.Root>
    </a>
  </div>

  <div class="hidden md:flex space-x-4">
    <Button variant="ghost" href="/">Home</Button>
    <Button variant="ghost" href="/projects">My projects</Button>
    <Button variant="ghost" href="/about">About me (wip)</Button>
    <ThemeToggler />
  </div>

  <div class="flex md:hidden space-x-4">
    <Button variant="ghost" size="icon" href="/" aria-label="Home">
      <Home class="w-5 h-5" />
    </Button>
    <Button variant="ghost" size="icon" href="/projects" aria-label="My projects">
      <Briefcase class="w-5 h-5" />
    </Button>
    <Button variant="ghost" size="icon" href="/about" aria-label="About me">
      <User class="w-5 h-5" />
    </Button>
    <ThemeToggler />
  </div>
</nav>
<div class="flex justify-center mx-6">
  <Separator />
</div>