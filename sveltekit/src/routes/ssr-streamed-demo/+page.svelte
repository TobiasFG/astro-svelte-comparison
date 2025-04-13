<script lang="ts">
    import type { RandomData } from "../api/test/+server";

    // Use Svelte 5 runes for page data
    const { data } = $props<{
        data: {
            streamedData: Promise<RandomData>;
            pageInfo: {
                title: string;
                renderedAt: string;
            };
        };
    }>();

    // Track when streaming started on the client
    let streamingStartTime = $state(new Date());

    // Track when streaming completes on the client
    let streamingCompleteTime = $state<Date | null>(null);
    let streamingDuration = $state<number | null>(null);

    // This will run when the data from streamedData promise resolves
    function onDataReceived() {
        streamingCompleteTime = new Date();
        streamingDuration =
            streamingCompleteTime.getTime() - streamingStartTime.getTime();
    }
</script>

<svelte:head>
    <title>SSR with Streaming Demo | SvelteKit</title>
    <meta
        name="description"
        content="Demonstration of server-side rendering with streaming in SvelteKit"
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

        <h1 class="text-3xl font-bold mb-2">SSR with Streaming</h1>
        <p class="text-gray-600 mb-8">
            Page renders immediately while data streams in gradually
        </p>

        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Demo</h2>
                <a
                    href="/ssr-streamed-demo"
                    class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    Refresh Page
                </a>
            </div>

            <div
                class="mb-6 bg-purple-50 border border-purple-100 rounded-md p-4"
            >
                <h3 class="font-medium mb-2 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    How This Works
                </h3>
                <p class="text-sm text-gray-700">
                    This page is immediately interactive while the data loads in
                    the background. Unlike traditional SSR, you don't have to
                    wait for all data before seeing the page. The HTML streams
                    incrementally to the browser.
                </p>
                <p class="text-sm mt-2 text-purple-700 font-medium">
                    Page rendered at: {data.pageInfo.renderedAt}
                </p>
            </div>

            {#await data.streamedData}
                <div
                    class="flex flex-col items-center justify-center space-y-4 py-12 border-2 border-dashed border-purple-200 rounded-lg"
                    role="status"
                    aria-live="polite"
                >
                    <div
                        class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                    ></div>
                    <div class="text-center">
                        <p class="text-gray-700 font-medium">
                            Streaming data from server...
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                            Started at: <time
                                dateTime={streamingStartTime.toISOString()}
                                >{streamingStartTime.toLocaleTimeString()}</time
                            >
                        </p>
                        <div class="mt-4 w-full max-w-xs mx-auto">
                            <div
                                class="bg-gray-200 h-1.5 rounded-full overflow-hidden"
                            >
                                <div
                                    class="h-full bg-purple-500 rounded-full animate-pulse-width"
                                ></div>
                            </div>
                        </div>
                        <p class="text-purple-600 mt-3 text-sm font-medium">
                            Notice you can interact with the page while data
                            loads!
                        </p>
                    </div>
                </div>
            {:then random}
                {onDataReceived()}
                <div class="space-y-6 animate-fade-in">
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
                                    {random.id}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Title</p>
                                <p class="font-medium">{random.title}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Date</p>
                                <p>
                                    <time
                                        dateTime={new Date(
                                            random.date,
                                        ).toISOString()}
                                    >
                                        {new Date(random.date).toLocaleString()}
                                    </time>
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Number</p>
                                <p class="font-mono">{random.number}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-purple-50 p-5 rounded-md border border-purple-100 shadow-sm"
                    >
                        <div class="flex items-center gap-2 mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-purple-500"
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
                                Streaming Performance
                            </h3>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-3">
                            <ul class="space-y-2 text-sm">
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Stream started:</span
                                    >
                                    <time
                                        dateTime={streamingStartTime.toISOString()}
                                        class="font-mono text-purple-700"
                                    >
                                        {streamingStartTime.toLocaleTimeString()}
                                    </time>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Stream completed:</span
                                    >
                                    {#if streamingCompleteTime}
                                        <time
                                            dateTime={streamingCompleteTime.toISOString()}
                                            class="font-mono text-purple-700"
                                        >
                                            {streamingCompleteTime.toLocaleTimeString()}
                                        </time>
                                    {/if}
                                </li>
                            </ul>
                            <ul class="space-y-2 text-sm">
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Streaming duration:</span
                                    >
                                    <span class="font-mono text-purple-700"
                                        >{streamingDuration}ms</span
                                    >
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-medium text-gray-600"
                                        >Status:</span
                                    >
                                    <span class="text-green-600">Complete</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            {:catch error}
                <div
                    class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md shadow-sm"
                    role="alert"
                    aria-labelledby="streaming-error-heading"
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
                            id="streaming-error-heading"
                            class="text-red-700 font-medium"
                        >
                            Error: {error.message || "Failed to stream data"}
                        </h3>
                    </div>
                    <div class="mt-3 space-y-2">
                        {#if streamingDuration}
                            <p class="text-sm text-red-600">
                                Error occurred after {streamingDuration}ms of
                                streaming
                            </p>
                        {/if}
                        <p class="text-sm text-gray-600">
                            The server was unable to complete the streaming
                            operation. This demonstrates how SSR streaming
                            handles errors - the page is still interactive and
                            usable even when data streaming fails.
                        </p>
                        <a
                            href="/ssr-streamed-demo"
                            class="inline-block mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label="Retry loading streaming data"
                        >
                            Retry Streaming
                        </a>
                    </div>
                </div>
            {/await}
        </div>

        <div class="bg-gray-50 rounded-lg border p-6 space-y-4">
            <h2 class="text-xl font-semibold">About SSR with Streaming</h2>

            <div>
                <h3 class="font-medium mb-2 text-lg">How it Works</h3>
                <p class="text-gray-600 mb-3">
                    SSR with streaming combines the best of server rendering and
                    client interactivity. The server starts sending HTML
                    immediately with a skeleton of the page, while
                    data-dependent parts are streamed in later as they become
                    available. This provides a fast initial render while
                    allowing slow data operations to complete later.
                </p>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Benefits</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Fast Initial Page Load:</span>
                        Shows UI skeleton immediately
                    </li>
                    <li>
                        <span class="font-medium">Progressive Loading:</span> Content
                        streams in as it becomes available
                    </li>
                    <li>
                        <span class="font-medium">Early Interactivity:</span> Users
                        can interact with parts of the page before all data loads
                    </li>
                    <li>
                        <span class="font-medium">Good for SEO:</span> Search engines
                        see most content in the initial HTML
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Drawbacks</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                        <span class="font-medium">Complex Implementation:</span>
                        More difficult to reason about than simple SSR
                    </li>
                    <li>
                        <span class="font-medium">Layout Shifts:</span> Content can
                        shift as streaming data arrives
                    </li>
                    <li>
                        <span class="font-medium">Error Handling:</span> Requires
                        careful error boundaries for streamed content
                    </li>
                    <li>
                        <span class="font-medium">Server Resources:</span> Keeps
                        connections open longer than regular SSR
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h3 class="font-medium mb-2 text-lg">Best For</h3>
                <ul class="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Pages with a mix of static and dynamic content</li>
                    <li>
                        UIs where some data takes longer to fetch than others
                    </li>
                    <li>
                        Applications that need good SEO but also fast
                        interactivity
                    </li>
                    <li>Improving user experience on slower connections</li>
                </ul>
            </div>
        </div>
    </div>
</div>
