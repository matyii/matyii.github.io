<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { pageTitle } from "$lib/stores/title";
  import { onDestroy, onMount } from "svelte";
  import { spotify } from "$lib/stores/spotify";
  import { motionPreference } from "$lib/stores/motion";
  import { MOTION, PARALLAX, motionDuration } from "$lib/utils/animation";
  import Navbar from "$lib/components/custom/Navbar.svelte";

  const { nowPlaying } = spotify;

  const staticTitle = "itsmatyii | Kristof Matyas";
  $: fullTitle = $pageTitle ? `${$pageTitle} - ${staticTitle}` : staticTitle;
  $: albumArt = $nowPlaying?.item?.album?.images?.[0]?.url ?? null;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId: number | null = null;
  let motionReadyRafA: number | null = null;
  let motionReadyRafB: number | null = null;

  $: reducedMotion = $motionPreference === "reduced";

  function handleMouseMove(event: MouseEvent) {
    if (reducedMotion || typeof window === "undefined") return;

    const normalizedX = event.clientX / window.innerWidth - 0.5;
    const normalizedY = event.clientY / window.innerHeight - 0.5;

    targetX = -normalizedX * PARALLAX.maxOffsetX;
    targetY = -normalizedY * PARALLAX.maxOffsetY;
  }

  function resetParallax() {
    targetX = 0;
    targetY = 0;
  }

  function animateParallax() {
    if (reducedMotion) {
      rafId = null;
      return;
    }

    currentX += (targetX - currentX) * PARALLAX.smoothing;
    currentY += (targetY - currentY) * PARALLAX.smoothing;
    rafId = requestAnimationFrame(animateParallax);
  }

  $: {
    if (typeof window === "undefined") {
      // no-op in SSR
    } else if (reducedMotion) {
      resetParallax();
      currentX = 0;
      currentY = 0;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (rafId === null) {
      rafId = requestAnimationFrame(animateParallax);
    }
  }

  onMount(() => {
    motionReadyRafA = requestAnimationFrame(() => {
      motionReadyRafB = requestAnimationFrame(() => {
        document.documentElement.classList.add("motion-ready");
      });
    });

    spotify.start();
  });

  onDestroy(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    if (motionReadyRafA !== null) {
      cancelAnimationFrame(motionReadyRafA);
    }
    if (motionReadyRafB !== null) {
      cancelAnimationFrame(motionReadyRafB);
    }
    spotify.stop();
  });
</script>

<svelte:head>
    <title>{fullTitle}</title>
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} on:mouseleave={resetParallax} />

<ModeWatcher defaultMode="dark" />
<Navbar />

<div class="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(77,148,255,0.12),transparent_28%),radial-gradient(circle_at_80%_8%,rgba(83,193,255,0.1),transparent_32%),radial-gradient(circle_at_55%_110%,rgba(96,83,255,0.1),transparent_28%)]"></div>
  <div class="ambient-gradient absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--background))_74%)]"></div>

  {#if albumArt}
    <div
      class="absolute inset-[-16%] bg-cover bg-center opacity-20 blur-3xl transition-opacity ease-standard motion-reduce:transition-none"
      style={`transition-duration: ${motionDuration(MOTION.duration.slow, reducedMotion)}ms; background-image: url(${albumArt}); transform: translate3d(${currentX}px, ${currentY}px, 0); will-change: transform;`}
    ></div>
  {/if}
</div>

<main class="relative z-10 mx-auto w-full max-w-7xl px-3 pb-16 pt-24 md:px-6 md:pt-28">
  <slot />
</main>