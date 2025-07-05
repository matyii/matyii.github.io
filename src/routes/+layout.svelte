<script lang="ts">
    import "../app.css";
    import { ModeWatcher } from "mode-watcher";
    import { pageTitle } from "$lib/stores/title";
    import { onMount, onDestroy } from 'svelte';
    import { spotify } from "$lib/stores/spotify";
    import { crossfade } from 'svelte/transition';

    const { nowPlaying } = spotify;

    // --- Crossfade logic ---
    import { tick } from 'svelte';
    import { writable } from 'svelte/store';

    let currentImage: string | null = null;
    let previousImage: string | null = null;
    let showPrev = writable(false);
    let prevImgEl: HTMLDivElement | null = null;
    let fadingToGradient = writable(false);

    const [send, receive] = crossfade({
    duration: 1800,
    fallback(node, params) {
        return {
        duration: 1800,
        css: t => `opacity: ${t}`
        };
    }
    });

    $: {
        const img = $nowPlaying?.item?.album?.images?.[0]?.url ?? null;
        if (img !== currentImage) {
            if (currentImage && !img) {
                // Fading from image to gradient
                previousImage = currentImage;
                showPrev.set(true);
                fadingToGradient.set(true);
                tick().then(() => {
                    if (prevImgEl) {
                        prevImgEl.classList.add('fade-out');
                    }
                });
                setTimeout(() => {
                    showPrev.set(false);
                    fadingToGradient.set(false);
                    if (prevImgEl) prevImgEl.classList.remove('fade-out');
                    previousImage = null;
                }, 1800);
            } else if (currentImage && img) {
                // Fading from image to image
                previousImage = currentImage;
                showPrev.set(true);
                fadingToGradient.set(false);
                tick().then(() => {
                    if (prevImgEl) {
                        prevImgEl.classList.add('fade-out');
                    }
                });
                setTimeout(() => {
                    showPrev.set(false);
                    if (prevImgEl) prevImgEl.classList.remove('fade-out');
                    previousImage = null;
                }, 1800);
            }
            currentImage = img;
        }
    }

    const staticTitle = "itsmatyii | Kristóf Mátyás";
    $: fullTitle = $pageTitle ? `${$pageTitle} - ${staticTitle}` : staticTitle;

    // Start/stop Spotify polling globally
    onMount(() => {
        spotify.start();
    });
    onDestroy(() => {
        spotify.stop();
    });
</script>

<svelte:head>
    <title>{fullTitle}</title>
</svelte:head>

<ModeWatcher />

<!-- Dynamic background for all pages with smooth transition -->
<style>
  .background-transition-wrapper {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -10;
  }
  .background-transition-img, .background-transition-gradient {
    position: fixed;
    inset: 0;
    width: 120vw;
    height: 120vh;
    left: -10vw;
    top: -10vh;
    pointer-events: none;
    will-change: opacity;
  }
  .bg-previous {
    opacity: 0.85;
    transition: opacity 1800ms cubic-bezier(0.4,0,0.2,1);
    z-index: -11;
  }
  .bg-current {
    opacity: 0.85;
    z-index: -12;
  }
</style>
<div class="background-transition-wrapper">
  {#if previousImage && $showPrev}
    <div
      class="background-transition-img bg-previous"
      bind:this={prevImgEl}
      style="
        background: url('{previousImage}') center center / cover no-repeat;
        filter: blur(80px) brightness(0.6);
        opacity: 0.85;
        z-index: -11;
      "
      aria-hidden="true"
      out:receive={{ key: previousImage }}
    ></div>
    {#if $fadingToGradient}
      <div
        class="background-transition-gradient bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 bg-current"
        style="
          filter: blur(80px) brightness(0.7);
          opacity: 0.85;
          z-index: -12;
        "
        aria-hidden="true"
      ></div>
    {/if}
  {/if}
  {#if currentImage}
    <div
      class="background-transition-img bg-current"
      style="
        background: url('{currentImage}') center center / cover no-repeat;
        filter: blur(80px) brightness(0.6);
        opacity: 0.85;
        z-index: -12;
      "
      aria-hidden="true"
      in:send={{ key: currentImage }}
    ></div>
  {/if}
  {#if !currentImage && !$showPrev}
    <div
      class="background-transition-gradient bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 bg-current"
      style="
        filter: blur(80px) brightness(0.7);
        opacity: 0.85;
        z-index: -12;
      "
      aria-hidden="true"
    ></div>
  {/if}
</div>

<slot />