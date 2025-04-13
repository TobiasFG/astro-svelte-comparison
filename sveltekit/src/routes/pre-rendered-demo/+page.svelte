<script lang="ts">
    import type { RandomData } from "../api/test/+server";

    // Use Svelte 5 runes for page data
    const { data } = $props<{
        data: {
            random?: RandomData;
            renderedAt?: string;
            buildDate?: string;
            error?: string | null;
        };
    }>();

    // Track when the client-side component mounted
    $effect(() => {
        // This will not change the pre-rendered content,
        // but will update the client time display after hydration
        clientTime = new Date();
    });

    let clientTime = $state(new Date());

    // Update the client time every second
    setInterval(() => {
        clientTime = new Date();
    }, 1000);
</script>

<svelte:head>
    <title>Pre-rendered Static Demo | SvelteKit</title>
    <meta
        name="description"
        content="Demonstration of pre-rendered static content in SvelteKit"
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

        <h1 class="text-3xl font-bold mb-2">Pre-rendered Static</h1>
        <p class="text-gray-600 mb-8">
            Content generated at build time, not when users visit the page
        </p>

        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Demo</h2>
                <a
                    href="/pre-rendered-demo"
                    class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Reload Page
                </a>
            </div>

            <div
                class="mb-6 bg-yellow-50 border border-yellow-100 rounded-md p-4"
            >
                <h3 class="font-medium mb-2 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    Important Note
                </h3>
                <p class="text-sm text-gray-700">
                    This page was pre-rendered at build time. The data you see
                    was fetched once when the site was built, not when you
                    loaded this page. Refreshing the page will show the same
                    data because it's static HTML.
                </p>
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
                    <p class="text-sm text-red-600 mt-2">
                        This error occurred at build time.
                    </p>
                </div>
            {:else if data?.random}
                <div class="space-y-6">
                    <div class="bg-gray-50 p-6 rounded-md">
                        <h3 class="font-medium text-lg mb-4">
                            Pre-rendered Data:
                        </h3>
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
                        class="bg-green-50 p-4 rounded-md border border-green-100"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-green-500"
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
                            <h3 class="font-medium">Build & Runtime Info</h3>
                        </div>
                        <ul class="space-y-1 text-sm">
                            <li>
                                <span class="font-medium">Built at:</span>
                                {new Date(data.buildDate).toLocaleString()}
                            </li>
                            <li>
                                <span class="font-medium"
                                    >Data rendered at:</span
                                >
                                {data.renderedAt}
                            </li>
                            <li>
                                <span class="font-medium"
                                    >Current client time:</span
                                >
                                {clientTime.toLocaleTimeString()}
                            </li>
                        </ul>
                        <p class="text-xs text-gray-500 mt-2">
                            Notice how refreshing doesn't change the data or
                            rendered time, only the client time.
                        </p>
                    </div>
                </div>
            {/if}
        </div>

        <div class="bg-gray-50 rounded-lg border p-6 space-y-4">
            <h2 class="text-xl font-semibold">About Pre-rendering</h2>

            <div>
                <h3 class="font-medium mb-2 text-lg">How it Works</h3>
                <p class="text-gray-600 mb-3">
                    Pre-rendering generates static HTML files at build time
                    instead of on-demand. When you build your site, SvelteKit
                    runs the load functions once, renders the pages, and
                    produces HTML files that can be served without any server
                    processing. This approach is also known as Static Site
                    Generation (SSG).
                </p>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Benefits</h3>
                <ul class="list-disc pl-6 spaces-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Ultra-Fast Performance:</span>
                        Pages are pre-built and can be served from a CDN
                    </li>
                    <li>
                        <span class="font-medium">Reduced Server Load:</span> No
                        server processing required at runtime
                    </li>
                    <li>
                        <span class="font-medium">Excellent for SEO:</span> Content
                        is immediately available in the HTML
                    </li>
                    <li>
                        <span class="font-medium"
                            >Works Without JavaScript:</span
                        > Core content is available in the static HTML
                    </li>
                    <li>
                        <span class="font-medium">High Reliability:</span> Less that
                        can go wrong at runtime
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Drawbacks</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Static Content:</span> Data is
                        fixed at build time
                    </li>
                    <li>
                        <span class="font-medium">Build Time:</span> Can be slow
                        for large sites with many pages
                    </li>
                    <li>
                        <span class="font-medium">Dynamic Content Issues:</span>
                        Not suitable for highly personalized or frequently changing
                        content
                    </li>
                    <li>
                        <span class="font-medium">Rebuild Required:</span> Site must
                        be rebuilt to update content
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Best For</h3>
                <ul class="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Marketing websites</li>
                    <li>Blogs and documentation sites</li>
                    <li>Content that doesn't change frequently</li>
                    <li>Sites where performance is critical</li>
                    <li>Pages that don't need personalization</li>
                </ul>
            </div>
        </div>
    </div>
</div>
