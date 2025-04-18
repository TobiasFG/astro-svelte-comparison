<script lang="ts">
    // Using Svelte 5's runes for reactivity
    import { onMount } from "svelte";

    // Track when the component is mounted for animation purposes
    let isVisible = $state(false);
    let isHovered = $state(false);
    let buildDate = $state(new Date().toLocaleDateString());

    onMount(() => {
        // When component mounts, set visible for animation
        isVisible = true;

        // Simulated "build date" for visual effect
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 2); // 2 days ago
        buildDate = pastDate.toLocaleDateString();
    });
</script>

<div
    class="bg-white rounded-lg shadow-lg p-6 min-h-[300px] relative overflow-hidden hover:shadow-xl transition-shadow duration-300"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    role="article"
>
    <div
        class:opacity-0={!isVisible}
        class:opacity-100={isVisible}
        class="transition-opacity duration-300"
    >
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold mb-4">Pre-rendered Static</h3>
            <div
                class="w-2 h-2 rounded-full bg-green-500 transition-all duration-500"
                class:animate-pulse={isHovered}
                class:w-4={isHovered}
                aria-hidden="true"
            ></div>
        </div>

        {#if isHovered}
            <div
                class="absolute top-2 right-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md transition-opacity duration-300 opacity-75"
            >
                Built: {buildDate}
            </div>
        {/if}

        <div class="mt-6 border-t pt-4">
            <p class="text-sm text-gray-600 mb-2 font-medium">
                Pre-rendering Benefits:
            </p>
            <ul class="text-xs text-gray-500 list-disc pl-5 space-y-1">
                <li>Ultra-fast page loads (static HTML)</li>
                <li>Excellent for SEO</li>
                <li>Can be served from CDN edge locations</li>
                <li>Minimal server load at runtime</li>
                <li>Works without JavaScript</li>
                <li>Perfect for content that rarely changes</li>
            </ul>
        </div>

        <div class="mt-4 text-center">
            <a
                href="/pre-rendered-demo"
                class="text-green-500 hover:text-green-700 inline-flex items-center gap-1 transition-colors group"
                aria-label="View full Pre-rendered Static demonstration"
            >
                <span>View Full Pre-rendered Demo</span>
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
