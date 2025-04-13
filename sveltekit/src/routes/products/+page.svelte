<!-- Server-side data loading demonstration with enhanced UX -->
<script lang="ts">
    import type { Product } from "../api/products/+server";
    import type { PageProps } from "./$types";
    import { page } from "$app/state";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    // Get data from the server using Svelte 5 runes syntax
    let { data }: PageProps = $props();
    let isRefreshing = $state(false);

    // Handle data that might be promises due to streaming
    let products = $derived(Array.isArray(data.products) ? data.products : []);
    let timestamp = $derived(data.timestamp || "");

    // Function to refresh the data
    async function refreshData() {
        isRefreshing = true;
        await invalidate("app:products");
        isRefreshing = false;
    }

    // Track page transitions to add CSS transitions
    let transitionClass = $state("");

    onMount(() => {
        // Add transition class after mount
        transitionClass = "transition-opacity duration-300 ease-in-out";
    });
</script>

<!-- SEO-friendly metadata -->
<svelte:head>
    <title>Products | Server-side Data Loading</title>
    <meta
        name="description"
        content="Browse our products with efficient server-side data loading"
    />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="flex flex-col items-center justify-center mb-8">
        <h1 class="text-3xl font-bold text-center mb-4" id="product-heading">
            Server-side Data Loading
        </h1>
        <p class="text-center text-gray-600 mb-2">
            Data fetched at: <time datetime={new Date(timestamp).toISOString()}
                >{new Date(timestamp).toLocaleTimeString()}</time
            >
        </p>
        <button
            onclick={refreshData}
            disabled={isRefreshing}
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none
                  disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Refresh product data"
            aria-disabled={isRefreshing}
        >
            {isRefreshing ? "Refreshing..." : "Refresh Products"}
        </button>
    </div>

    <!-- ARIA live region to announce when products update -->
    <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isRefreshing
            ? "Loading products..."
            : `${products.length} products loaded`}
    </div>

    <!-- Products grid with loading states -->
    <div
        class:opacity-70={isRefreshing}
        class:pointer-events-none={isRefreshing}
        class={[
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
            transitionClass,
        ]}
        aria-labelledby="product-heading"
        aria-busy={isRefreshing}
    >
        {#each products as product (product.id)}
            <div
                class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
                <img
                    src={product.image}
                    alt={product.name}
                    class="w-full h-48 object-cover"
                    loading="lazy"
                    width="300"
                    height="300"
                />
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2">{product.name}</h2>
                    <p class="text-gray-600 mb-4">{product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-bold"
                            >${product.price.toFixed(2)}</span
                        >
                        <button
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`Add ${product.name} to cart`}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
