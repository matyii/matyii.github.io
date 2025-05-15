<script lang="ts">
    import "../app.css";
    import { ModeWatcher } from "mode-watcher";
    import { pageTitle } from "$lib/stores/title";
    
    const staticTitle = "itsmatyii | Kristóf Mátyás";
    $: fullTitle = $pageTitle ? `${$pageTitle} - ${staticTitle}` : staticTitle;
</script>

<svelte:head>
    <title>{fullTitle}</title>
</svelte:head>

<ModeWatcher />
<slot />