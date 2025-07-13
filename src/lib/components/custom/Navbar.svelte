<script lang='ts'>
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Home, Briefcase, User } from "@lucide/svelte";
</script>

<nav class="flex items-center justify-between px-2 sm:px-6 md:px-10 py-2 md:py-3 my-6 mx-auto max-w-3xl 2xl:max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl transition-all duration-300">
  <a href="/" aria-label="Go to main page" class="flex items-center gap-1 sm:gap-3 group rounded-xl transition-all duration-200">
    <Avatar.Root class="size-10 rounded-full border-2 border-white/40 shadow-xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95 group-hover:border-indigo-300/80 group-focus:border-indigo-400/80">
      <Avatar.Image src="/pfp.png" alt="@matyii" class="rounded-full" />
      <Avatar.Fallback class="text-xs">MK</Avatar.Fallback>
    </Avatar.Root>
    <span class="hidden sm:inline font-bold text-lg tracking-tight text-white drop-shadow">itsmatyii <span class="floating-planet">🪐</span></span>
  </a>

  <div class="flex gap-1 md:gap-4 items-center">
    <Button variant="ghost" href="/" aria-label="Home" class="flex items-center gap-2 transition-all duration-150 hover:bg-white/20 active:bg-white/30 rounded-lg">
      <Home class="w-5 h-5 text-white" />
      <span class="hidden md:inline text-white">Home</span>
    </Button>
    <Button variant="ghost" href="/projects" aria-label="My projects" class="flex items-center gap-2 transition-all duration-150 hover:bg-white/20 active:bg-white/30 rounded-lg">
      <Briefcase class="w-5 h-5 text-white" />
      <span class="hidden md:inline text-white">My projects</span>
    </Button>
    <Button variant="ghost" href="/about" aria-label="About me" class="flex items-center gap-2 transition-all duration-150 hover:bg-white/20 active:bg-white/30 rounded-lg">
      <User class="w-5 h-5 text-white" />
      <span class="hidden md:inline text-white">About me</span>
    </Button>
  </div>
</nav>