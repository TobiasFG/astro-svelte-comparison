<!-- filepath: /Users/tfg/Documents/astro-svelte-comparison/sveltekit/src/routes/+page.svelte -->
<script lang="ts">
    import TodoApp from "$lib/components/TodoApp/TodoApp.svelte";
    import * as TimerAppModule from "$lib/components/TimerApp/TimerApp.svelte";
    import NotificationApp from "$lib/components/NotificationApp/NotificationApp.svelte";
    import ClientDataApp from "$lib/components/ClientDataApp/ClientDataApp.svelte";

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
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 bg-gray-50 border-b">
                    <h3 class="font-medium text-gray-800">Notification App</h3>
                </div>
                <div class="flex items-center justify-center p-6 min-h-[250px]">
                    <NotificationApp />
                </div>
            </div>

            <!-- Client-side Data Loading App -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 bg-gray-50 border-b">
                    <h3 class="font-medium text-gray-800">
                        Client-side Data Loading
                    </h3>
                </div>
                <div class="p-6">
                    <ClientDataApp />
                </div>
            </div>
        </div>
    </section>

    <section aria-labelledby="api-section">
        <h2 id="api-section" class="text-2xl font-semibold mb-4 text-gray-800">
            Data Loading Pages
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
                href="/products"
                class="block bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
                <h3 class="text-xl font-semibold mb-2 text-blue-600">
                    Server-side Data Loading
                </h3>
                <p class="text-gray-600 mb-4">
                    This page demonstrates SvelteKit's built-in server-side data
                    loading capabilities.
                </p>
                <div class="flex items-center text-blue-500">
                    <span>View demo</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </a>

            <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-xl font-semibold mb-2 text-blue-600">
                    Client-side Data Loading
                </h3>
                <p class="text-gray-600">
                    The component above demonstrates client-side data loading
                    with proper loading and error states.
                </p>
            </div>
        </div>
    </section>
</div>
