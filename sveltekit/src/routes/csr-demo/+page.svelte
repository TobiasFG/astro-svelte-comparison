<script lang="ts">
    import { onMount } from "svelte";

    /**
     * Define types for our data - using proper TypeScript interfaces
     * for better type safety and code documentation
     */
    interface RandomData {
        id: string;
        title: string;
        date: string;
        number: string;
    }

    // State management using Svelte 5 runes
    let data = $state<RandomData | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let loadStart = $state<Date | null>(null);
    let loadEnd = $state<Date | null>(null);
    let loadTime = $state<number | null>(null);
    let refreshCount = $state(0);

    // Track metrics for analytics
    let metrics = $state({
        fetchAttempts: 0,
        successfulFetches: 0,
        failedFetches: 0,
        averageLoadTime: 0,
    });

    /**
     * Function to fetch data - properly typed with error handling
     * and performance tracking
     */
    async function fetchData() {
        loading = true;
        error = null;
        loadStart = new Date();
        loadTime = null;
        refreshCount++;
        metrics.fetchAttempts++;

        try {
            // Use AbortController for better request management
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch("/api/test", {
                signal: controller.signal,
                headers: {
                    Accept: "application/json",
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            data = await response.json();
            loadEnd = new Date();
            loadTime = loadEnd.getTime() - loadStart.getTime();

            // Update success metrics
            metrics.successfulFetches++;
            metrics.averageLoadTime =
                (metrics.averageLoadTime * (metrics.successfulFetches - 1) +
                    loadTime) /
                metrics.successfulFetches;
        } catch (err) {
            // Proper error handling with improved type checking
            error =
                err instanceof Error
                    ? err.message
                    : err instanceof DOMException && err.name === "AbortError"
                      ? "Request timed out"
                      : "An unknown error occurred";

            loadEnd = new Date();
            loadTime = loadEnd?.getTime() - loadStart.getTime();
            metrics.failedFetches++;
        } finally {
            loading = false;
        }
    }

    // Create a derived state for formatted metrics
    const formattedAverageTime = $derived(
        metrics.successfulFetches > 0
            ? `${metrics.averageLoadTime.toFixed(0)}ms`
            : "N/A",
    );

    // Fetch data on component mount and clean up any side effects
    onMount(() => {
        fetchData();

        // Return cleanup function
        return () => {
            // Any cleanup needed when component unmounts
        };
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
                <div class="flex items-center gap-3">
                    {#if refreshCount > 0}
                        <span
                            class="text-xs text-gray-500 hidden sm:inline-block"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            Refreshed {refreshCount} time{refreshCount !== 1
                                ? "s"
                                : ""}
                        </span>
                    {/if}
                    <button
                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                        onclick={fetchData}
                        disabled={loading}
                        aria-busy={loading}
                        aria-label={loading
                            ? "Refreshing data..."
                            : "Refresh data"}
                    >
                        <span class="flex items-center gap-2">
                            {#if loading}
                                <svg
                                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            {/if}
                            {loading ? "Refreshing..." : "Refresh Data"}
                        </span>
                    </button>
                </div>
            </div>

            <div aria-live="polite" class="relative">
                {#if loading}
                    <div
                        class="flex flex-col items-center justify-center space-y-3 py-12 bg-white rounded-md transition-opacity duration-300"
                        role="status"
                    >
                        <div
                            class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                            aria-hidden="true"
                        ></div>
                        <p class="text-gray-700 font-medium">
                            Loading data from API...
                        </p>
                        {#if loadStart}
                            <p class="text-sm text-gray-500">
                                Loading started at: {loadStart.toLocaleTimeString()}
                            </p>
                        {/if}
                    </div>
                {:else if error}
                    <div
                        class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md shadow-sm"
                        role="alert"
                        aria-labelledby="error-heading"
                    >
                        <div class="flex items-center">
                            <svg
                                class="h-6 w-6 text-red-500 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3
                                id="error-heading"
                                class="text-red-700 font-medium"
                            >
                                Error: {error}
                            </h3>
                        </div>
                        <div class="mt-3 space-y-2">
                            {#if loadTime}
                                <p class="text-sm text-red-600">
                                    Error occurred after {loadTime}ms
                                </p>
                            {/if}
                            <button
                                class="text-sm text-red-700 hover:text-red-900 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                                onclick={fetchData}
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                {:else if data}
                    <div class="space-y-6 animate-fadeIn">
                        <div class="bg-gray-50 p-6 rounded-md shadow-sm">
                            <h3 class="font-medium text-lg mb-4 text-gray-800">
                                Random Data:
                            </h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-500 mb-1">ID</p>
                                    <p
                                        class="font-mono bg-gray-100 p-2 rounded text-sm break-all"
                                    >
                                        {data.id}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 mb-1">
                                        Title
                                    </p>
                                    <p class="font-medium">{data.title}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 mb-1">
                                        Date
                                    </p>
                                    <p>
                                        <time
                                            datetime={new Date(
                                                data.date,
                                            ).toISOString()}
                                        >
                                            {new Date(
                                                data.date,
                                            ).toLocaleString()}
                                        </time>
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 mb-1">
                                        Number
                                    </p>
                                    <p class="font-mono">{data.number}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-blue-50 p-5 rounded-md border border-blue-100 shadow-sm"
                        >
                            <div class="flex items-center gap-2 mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <h3 class="font-medium text-gray-800">
                                    Performance Metrics
                                </h3>
                            </div>
                            <div class="grid sm:grid-cols-2 gap-4">
                                <ul class="space-y-2 text-sm">
                                    <li class="flex justify-between">
                                        <span class="font-medium text-gray-600"
                                            >Load time:</span
                                        >
                                        <span class="font-mono text-blue-800"
                                            >{loadTime}ms</span
                                        >
                                    </li>
                                    <li class="flex justify-between">
                                        <span class="font-medium text-gray-600"
                                            >Loaded at:</span
                                        >
                                        <span
                                            >{loadEnd?.toLocaleTimeString()}</span
                                        >
                                    </li>
                                    <li class="flex justify-between">
                                        <span class="font-medium text-gray-600"
                                            >Rendered at:</span
                                        >
                                        <span
                                            >{new Date().toLocaleTimeString()}</span
                                        >
                                    </li>
                                </ul>
                                <ul class="space-y-2 text-sm">
                                    <li class="flex justify-between">
                                        <span class="font-medium text-gray-600"
                                            >Fetch attempts:</span
                                        >
                                        <span>{metrics.fetchAttempts}</span>
                                    </li>
                                    <li class="flex justify-between">
                                        <span class="font-medium text-gray-600"
                                            >Successful:</span
                                        >
                                        <span>{metrics.successfulFetches}</span>
                                    </li>
                                    <li class="flex justify-between">
                                        <span class="font-medium text-gray-600"
                                            >Average time:</span
                                        >
                                        <span class="font-mono text-blue-800"
                                            >{formattedAverageTime}</span
                                        >
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
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
