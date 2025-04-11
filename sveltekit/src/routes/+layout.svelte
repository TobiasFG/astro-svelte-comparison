<script lang="ts">
    import "../app.css";

    let { children } = $props();
</script>

<svelte:head>
    <title>SvelteKit Proformance Test</title>
    <meta
        name="description"
        content="A minimal SvelteKit app with SSR, Tailwind CSS, and Typescript to test performance."
    />
</svelte:head>

{@render children()}
