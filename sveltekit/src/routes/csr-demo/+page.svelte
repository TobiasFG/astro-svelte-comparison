<script lang="ts">
    import { onMount } from "svelte";

    // Define types for our data
    type RandomData = {
        id: string;
        title: string;
        date: string;
        number: string;
    };

    // Use Svelte 5 runes for state management
    let data = $state<RandomData | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let loadStart = $state<Date | null>(null);
    let loadEnd = $state<Date | null>(null);
    let loadTime = $state<number | null>(null);

    // Function to fetch data
    async function fetchData() {
        loading = true;
        error = null;
        loadStart = new Date();
        loadTime = null;

        try {
            const response = await fetch("/api/test");
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            data = await response.json();
            loadEnd = new Date();
            loadTime = loadEnd.getTime() - loadStart.getTime();
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred";
            loadEnd = new Date();
            loadTime = loadEnd.getTime() - loadStart.getTime();
        } finally {
            loading = false;
        }
    }

    // Fetch data on component mount
    onMount(() => {
        fetchData();
    });
</script>

<svelte:head>
    <title>Client-Side Rendering Demo | SvelteKit</title>
    <meta
        name="description"
        content="Demonstration of client-side rendering in SvelteKit"
    />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
        <div class="mb-8">
            <a
                href="/"
                class="text-blue-500 hover:underline flex items-center gap-1"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Home
            </a>
        </div>

        <h1 class="text-3xl font-bold mb-2">Client-Side Rendering</h1>
        <p class="text-gray-600 mb-8">
            Data is fetched by the browser after the component mounts
        </p>

        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Demo</h2>
                <button
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    onclick={fetchData}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh Data"}
                </button>
            </div>

            {#if loading}
                <div
                    class="flex flex-col items-center justify-center space-y-3 py-12"
                >
                    <div
                        class="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                    <p class="text-gray-500">Loading data from API...</p>
                    {#if loadStart}
                        <p class="text-sm text-gray-400">
                            Loading started at: {loadStart.toLocaleTimeString()}
                        </p>
                    {/if}
                </div>
            {:else if error}
                <div
                    class="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded"
                >
                    <div class="flex items-center">
                        <svg
                            class="h-6 w-6 text-red-500 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p class="text-red-700">Error: {error}</p>
                    </div>
                    {#if loadTime}
                        <p class="mt-2 text-sm text-red-600">
                            Error occurred after {loadTime}ms
                        </p>
                    {/if}
                </div>
            {:else if data}
                <div class="space-y-6">
                    <div class="bg-gray-50 p-6 rounded-md">
                        <h3 class="font-medium text-lg mb-4">Random Data:</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">ID</p>
                                <p class="font-mono bg-gray-100 p-2 rounded">
                                    {data.id}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Title</p>
                                <p class="font-medium">{data.title}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Date</p>
                                <p>{new Date(data.date).toLocaleString()}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Number</p>
                                <p class="font-mono">{data.number}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-blue-50 p-4 rounded-md border border-blue-100"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            <h3 class="font-medium">Performance Metrics</h3>
                        </div>
                        <ul class="space-y-1 text-sm">
                            <li>
                                <span class="font-medium">Load time:</span>
                                {loadTime}ms
                            </li>
                            <li>
                                <span class="font-medium">Loaded at:</span>
                                {loadEnd?.toLocaleTimeString()}
                            </li>
                            <li>
                                <span class="font-medium"
                                    >Rendered client-side at:</span
                                >
                                {new Date().toLocaleTimeString()}
                            </li>
                        </ul>
                    </div>
                </div>
            {/if}
        </div>

        <div class="bg-gray-50 rounded-lg border p-6 space-y-4">
            <h2 class="text-xl font-semibold">About Client-Side Rendering</h2>

            <div>
                <h3 class="font-medium mb-2 text-lg">How it Works</h3>
                <p class="text-gray-600 mb-3">
                    In client-side rendering (CSR), the initial HTML sent from
                    the server contains minimal markup. After the JavaScript
                    bundle loads in the browser, the component mounts and
                    triggers a fetch request to get the data. The UI is then
                    rendered entirely in the browser.
                </p>
                <pre
                    class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm"><code
                    ></code></pre>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Benefits</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Dynamic Updates:</span> Can refresh
                        data without reloading the page
                    </li>
                    <li>
                        <span class="font-medium">Reduced Server Load:</span> Data
                        processing happens in the browser
                    </li>
                    <li>
                        <span class="font-medium">Rich Interactivity:</span> Great
                        for highly interactive applications
                    </li>
                    <li>
                        <span class="font-medium">Caching Control:</span> Can implement
                        sophisticated client-side caching
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Drawbacks</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Initial Load:</span> Users see
                        a loading state before content appears
                    </li>
                    <li>
                        <span class="font-medium">SEO Limitations:</span> Search
                        engines may not see the full content
                    </li>
                    <li>
                        <span class="font-medium">JavaScript Dependency:</span> Requires
                        JavaScript to function
                    </li>
                    <li>
                        <span class="font-medium">Network Waterfall:</span> Multiple
                        round-trips needed (HTML → JS → API data)
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Best For</h3>
                <ul class="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Dashboards and admin interfaces</li>
                    <li>Highly interactive applications</li>
                    <li>Real-time data that updates frequently</li>
                    <li>User-specific content after authentication</li>
                </ul>
            </div>
        </div>
    </div>
</div>
