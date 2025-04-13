<script lang="ts">
    // Import data from the page load
    export let data;
</script>

<svelte:head>
    <title>Server-Side Rendering Demo | SvelteKit</title>
    <meta
        name="description"
        content="Demonstration of server-side rendering in SvelteKit"
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

        <h1 class="text-3xl font-bold mb-2">Server-Side Rendering</h1>
        <p class="text-gray-600 mb-8">
            Data is fetched on the server before the HTML is sent to the browser
        </p>

        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Demo</h2>
                <a
                    href="/ssr-demo"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Refresh Page
                </a>
            </div>

            {#if data?.error}
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
                        <p class="text-red-700">Error: {data.error}</p>
                    </div>
                </div>
            {:else if data?.random}
                <div class="space-y-6">
                    <div class="bg-gray-50 p-6 rounded-md">
                        <h3 class="font-medium text-lg mb-4">Random Data:</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">ID</p>
                                <p class="font-mono bg-gray-100 p-2 rounded">
                                    {data.random.id}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Title</p>
                                <p class="font-medium">{data.random.title}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Date</p>
                                <p>
                                    {new Date(
                                        data.random.date,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Number</p>
                                <p class="font-mono">{data.random.number}</p>
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
                                <span class="font-medium"
                                    >Server load time:</span
                                >
                                {data.loadTime}ms
                            </li>
                            <li>
                                <span class="font-medium"
                                    >Server rendered at:</span
                                >
                                {data.renderedAt}
                            </li>
                            <li>
                                <span class="font-medium"
                                    >Current client time:</span
                                >
                                {new Date().toLocaleTimeString()}
                            </li>
                        </ul>
                    </div>
                </div>
            {/if}
        </div>

        <div class="bg-gray-50 rounded-lg border p-6 space-y-4">
            <h2 class="text-xl font-semibold">About Server-Side Rendering</h2>

            <div>
                <h3 class="font-medium mb-2 text-lg">How it Works</h3>
                <p class="text-gray-600 mb-3">
                    In server-side rendering (SSR), the server fetches all
                    required data and generates the complete HTML before sending
                    it to the browser. The page is fully rendered when it
                    arrives at the client, providing immediate content display.
                </p>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Benefits</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium"
                            >Immediate Content Display:</span
                        > No loading state for initial page load
                    </li>
                    <li>
                        <span class="font-medium">Better SEO:</span> Search engines
                        see the full content in the HTML
                    </li>
                    <li>
                        <span class="font-medium"
                            >Works Without JavaScript:</span
                        > Core content is available even if JS fails
                    </li>
                    <li>
                        <span class="font-medium">Improved Performance:</span> Fewer
                        network requests for initial load
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Drawbacks</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Server Load:</span> Requires more
                        server processing power
                    </li>
                    <li>
                        <span class="font-medium"
                            >TTFB (Time To First Byte):</span
                        > May be slower as server must process before responding
                    </li>
                    <li>
                        <span class="font-medium">Full Page Reloads:</span> Data
                        refreshes typically require full page reload
                    </li>
                    <li>
                        <span class="font-medium"
                            >Server/Client State Sync:</span
                        > Can be tricky to manage state between server and client
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Best For</h3>
                <ul class="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Content-focused websites where SEO is important</li>
                    <li>Pages that don't need frequent client-side updates</li>
                    <li>
                        Experiences where immediate content display is critical
                    </li>
                    <li>
                        Applications that need to work well without JavaScript
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
