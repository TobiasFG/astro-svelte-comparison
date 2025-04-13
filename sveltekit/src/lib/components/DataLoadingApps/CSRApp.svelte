<script lang="ts">
    // Using Svelte 5's runes for reactivity
    import { onMount } from "svelte";

    // Track when the component is mounted for animation purposes
    let isVisible = $state(false);
    let isHovered = $state(false);

    onMount(() => {
        // When component mounts, set visible for animation
        isVisible = true;
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
            <h3 class="text-lg font-semibold mb-4">Client-Side Rendering</h3>
            <div
                class="w-2 h-2 rounded-full bg-blue-500 transition-all duration-500"
                class:animate-pulse={isHovered}
                class:w-4={isHovered}
                aria-hidden="true"
            ></div>
        </div>

        <div class="mt-6 border-t pt-4">
            <p class="text-sm text-gray-600 mb-2 font-medium">CSR Benefits:</p>
            <ul class="text-xs text-gray-500 list-disc pl-5 space-y-1">
                <li>Interactive without full page reload</li>
                <li>Lower server load (data fetched in browser)</li>
                <li>Works well for dynamic, personalized content</li>
                <li>Updates without page navigation</li>
                <li>Ideal for highly interactive applications</li>
            </ul>
        </div>

        <div class="mt-4 text-center">
            <a
                href="/csr-demo"
                class="text-blue-500 hover:text-blue-700 inline-flex items-center gap-1 transition-colors group"
                aria-label="View full Client-Side Rendering demonstration"
            >
                <span>View Full CSR Demo</span>
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
