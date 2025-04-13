<script lang="ts">
    // Using Svelte 5's runes for reactivity
    import { onMount } from "svelte";

    // Track when the component is mounted for animation purposes
    let isVisible = $state(false);
    let isHovered = $state(false);

    // For the streaming animation effect
    let streamingProgress = $state(0);
    let streamingInterval: ReturnType<typeof setInterval> | null = $state(null);

    onMount(() => {
        // When component mounts, set visible for animation
        isVisible = true;
    });

    // Handle streaming animation when hovered
    $effect(() => {
        if (isHovered && !streamingInterval) {
            streamingProgress = 0;
            streamingInterval = setInterval(() => {
                if (streamingProgress >= 100) {
                    if (streamingInterval) {
                        clearInterval(streamingInterval);
                        streamingInterval = null;
                    }
                } else {
                    streamingProgress += Math.random() * 15;
                    if (streamingProgress > 100) streamingProgress = 100;
                }
            }, 300);
        } else if (!isHovered && streamingInterval) {
            clearInterval(streamingInterval);
            streamingInterval = null;
            streamingProgress = 0;
        }
    });

    // Clean up interval on component destruction
    onMount(() => {
        return () => {
            if (streamingInterval) {
                clearInterval(streamingInterval);
            }
        };
    });
</script>

<div
    class="bg-white rounded-lg shadow-lg p-6 min-h-[300px] relative overflow-hidden hover:shadow-xl transition-shadow duration-300"
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
>
    <div
        class:opacity-0={!isVisible}
        class:opacity-100={isVisible}
        class="transition-opacity duration-300"
    >
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold mb-4">SSR with Streaming</h3>
            <div
                class="w-2 h-2 rounded-full bg-purple-500 transition-all duration-500"
                class:animate-pulse={isHovered && !streamingInterval}
                class:w-4={isHovered}
                aria-hidden="true"
            ></div>
        </div>

        {#if isHovered && streamingProgress > 0}
            <div
                class="absolute top-2 right-2 flex items-center gap-2 text-xs text-purple-500 transition-opacity duration-300 opacity-75"
            >
                <span>Streaming</span>
                <div
                    class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden"
                >
                    <div
                        class="bg-purple-500 h-full transition-all duration-300"
                        style="width: {streamingProgress}%"
                    ></div>
                </div>
            </div>
        {/if}

        <div class="mt-6 border-t pt-4">
            <p class="text-sm text-gray-600 mb-2 font-medium">
                SSR with streaming Benefits:
            </p>
            <ul class="text-xs text-gray-500 list-disc pl-5 space-y-1">
                <li>Better SEO as content is in initial HTML</li>
                <li>Faster initial content display</li>
                <li>Progressive loading of dynamic content</li>
                <li>Early user interactivity</li>
                <li>Improved perceived performance</li>
            </ul>
        </div>

        <div class="mt-4 text-center">
            <a
                href="/ssr-streamed-demo"
                class="text-purple-500 hover:text-purple-700 inline-flex items-center gap-1 transition-colors group"
                aria-label="View full Server-Side Rendering with streaming demonstration"
            >
                <span>View Full SSR with Streaming Demo</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </a>
        </div>
    </div>
</div>
