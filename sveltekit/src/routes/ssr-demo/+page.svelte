<script lang="ts">
    function formatTimeElapsed(time: number): string {
        if (time < 60) return `${time} seconds`;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}`;
    }

    // Create a derived value that formats the time elapsed
    let timeElapsed = $state(0);
    const formattedTimeElapsed = $derived(formatTimeElapsed(timeElapsed));
    import { onMount } from "svelte";
    import type { RandomData } from "../api/test/+server";

    // Use Svelte 5 runes for page data
    interface PageData {
        random: RandomData | null;
        renderedAt: string;
        loadTime: number | null;
        error: string | null;
    }

    // Page data using Svelte 5 runes syntax
    const { data } = $props<{ data: PageData }>();

    // Client-side rendering time for comparison
    let clientRenderTime = $state(new Date().toLocaleTimeString());

    let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);

    // Calculate time elapsed since server rendering
    $effect(() => {
        if (data?.renderedAt) {
            const updateElapsedTime = () => {
                try {
                    // Extract hours, minutes, seconds from the server time
                    const [time, period] = data.renderedAt.split(" ");
                    const [hours, minutes, seconds] = time
                        .split(":")
                        .map(Number);

                    // Adjust for AM/PM if present
                    let serverHours = hours;
                    if (period?.toLowerCase() === "pm" && hours < 12) {
                        serverHours += 12;
                    } else if (period?.toLowerCase() === "am" && hours === 12) {
                        serverHours = 0;
                    }

                    // Create server date object for today with the rendered time
                    const serverDate = new Date();
                    serverDate.setHours(serverHours, minutes, seconds || 0);

                    // Calculate difference in seconds
                    const now = new Date();
                    timeElapsed = Math.floor(
                        (now.getTime() - serverDate.getTime()) / 1000,
                    );

                    // Update client render time
                    clientRenderTime = now.toLocaleTimeString();
                } catch (e) {
                    // Fallback if time parsing fails
                    console.error("Error parsing server time:", e);
                }
            };

            // Initial calculation
            updateElapsedTime();

            // Update every second
            timerInterval = setInterval(updateElapsedTime, 1000);
        }
    });

    // Cleanup interval on unmount
    onMount(() => {
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    });
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

            <div
                class="mb-4 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md"
            >
                <div class="flex items-center">
                    <svg
                        class="h-6 w-6 text-indigo-500 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p class="text-indigo-700">
                        <span class="font-medium">Server-Side Rendered:</span>
                        This page was rendered on the server {formattedTimeElapsed}
                        ago.
                    </p>
                </div>
            </div>

            {#if data?.error}
                <div
                    class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md"
                    role="alert"
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
                        <h3 class="text-red-700 font-medium">
                            Error: {data.error}
                        </h3>
                    </div>
                    <p class="mt-2 text-sm text-red-600">
                        This error occurred on the server during page rendering.
                        Try refreshing the page.
                    </p>
                </div>
            {:else if data?.random}
                <div class="space-y-6">
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
                                    {data.random.id}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Title</p>
                                <p class="font-medium">{data.random.title}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Date</p>
                                <p>
                                    <time
                                        datetime={new Date(
                                            data.random.date,
                                        ).toISOString()}
                                    >
                                        {new Date(
                                            data.random.date,
                                        ).toLocaleString()}
                                    </time>
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Number</p>
                                <p class="font-mono">{data.random.number}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-indigo-50 p-5 rounded-md border border-indigo-100 shadow-sm"
                    >
                        <div class="flex items-center gap-2 mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-indigo-500"
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
                                        >Server load time:</span
                                    >
                                    <span class="font-mono text-indigo-800"
                                        >{data.loadTime}ms</span
                                    >
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Server rendered at:</span
                                    >
                                    <span>{data.renderedAt}</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Time since render:</span
                                    >
                                    <span>{formattedTimeElapsed}</span>
                                </li>
                            </ul>
                            <ul class="space-y-2 text-sm">
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Client time now:</span
                                    >
                                    <span>{clientRenderTime}</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >JavaScript:</span
                                    >
                                    <span class="text-green-600">Hydrated</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Rendering:</span
                                    >
                                    <span class="text-indigo-600"
                                        >Server-side</span
                                    >
                                </li>
                            </ul>
                        </div>
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
