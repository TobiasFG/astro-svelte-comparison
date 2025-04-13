<!-- Server-side data loading demonstration -->
<script lang="ts">
    import type { PageData } from "./$types";

    // Properly define reactive variables using Svelte 5 runes syntax
    const { products, timestamp } = $props();
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-4">
        Server-side Data Loading
    </h1>
    <p class="text-center text-gray-600 mb-6">
        Data fetched at: {new Date(timestamp).toLocaleTimeString()}
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each products as product}
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
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
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
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
