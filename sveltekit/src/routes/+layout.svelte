<script lang="ts">
    import "../app.css";
    import NavBar from "$lib/components/NavBar/NavBar.svelte";
    import NotificationCenter from "$lib/components/NotificationApp/NotificationCenter.svelte";
    import { initNotificationStore } from "$lib/stores/notification-store.svelte";

    let { children } = $props();

    // Initialize the notification store
    const notificationStore = initNotificationStore();
</script>

<svelte:head>
    <title>SvelteKit Proformance Test</title>
    <meta
        name="description"
        content="A minimal SvelteKit app with SSR, Tailwind CSS, and Typescript to test performance."
    />
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <NavBar title="SvelteKit Apps" />
    <main>
        {@render children()}
    </main>
</div>

<NotificationCenter />
