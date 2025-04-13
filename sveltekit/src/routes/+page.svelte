<!-- filepath: /Users/tfg/Documents/astro-svelte-comparison/sveltekit/src/routes/+page.svelte -->
<script lang="ts">
    import TodoApp from "$lib/components/TodoApp/TodoApp.svelte";
    import * as TimerAppModule from "$lib/components/TimerApp/TimerApp.svelte";
    import NotificationApp from "$lib/components/NotificationApp/NotificationApp.svelte";
    import CSRApp from "$lib/components/DataLoadingApps/CSRApp.svelte";
    import SSRApp from "$lib/components/DataLoadingApps/SSRApp.svelte";
    import SSRStreamedApp from "$lib/components/DataLoadingApps/SSRStreamedApp.svelte";
    import PreRenderedApp from "$lib/components/DataLoadingApps/PreRenderedApp.svelte";

    const TimerApp = TimerAppModule.default || TimerAppModule;
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">My Test Applications</h1>

    <section aria-labelledby="app-section" class="mb-12">
        <h2 id="app-section" class="text-2xl font-semibold mb-4 text-gray-800">
            Component Apps
        </h2>
        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            <!-- Todo App -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 bg-gray-50 border-b">
                    <h3 class="font-medium text-gray-800">Todo App</h3>
                </div>
                <TodoApp />
            </div>

            <!-- Timer App -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 bg-gray-50 border-b">
                    <h3 class="font-medium text-gray-800">Timer App</h3>
                </div>
                <TimerApp />
            </div>

            <!-- Notification App -->
            <div
                class=" col-span-2 bg-white rounded-lg shadow-lg overflow-hidden"
            >
                <div class="p-4 bg-gray-50 border-b">
                    <h3 class="font-medium text-gray-800">Notification App</h3>
                </div>
                <div class="flex items-center justify-center p-6 min-h-[250px]">
                    <NotificationApp />
                </div>
            </div>
        </div>
    </section>

    <section aria-labelledby="data-loading-section" class="mt-12">
        <h2
            id="data-loading-section"
            class="text-2xl font-semibold mb-6 text-gray-800"
        >
            Data Loading Examples
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CSRApp />
            <SSRApp />
            <SSRStreamedApp />
            <PreRenderedApp />
        </div>
    </section>
</div>
