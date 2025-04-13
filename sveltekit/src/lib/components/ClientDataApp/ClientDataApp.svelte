<!-- Client-side data loading demonstration -->
<script lang="ts">
    import { onMount } from "svelte";

    type Product = {
        id: number;
        name: string;
        price: number;
        description: string;
        image: string;
    };

    // Properly defining reactive state using Svelte 5 runes syntax
    let products = $state<Product[]>([]);
    let isLoading = $state(true);
    let error = $state<string | null>(null);
    let timestamp = $state("");

    async function loadProducts() {
        isLoading = true;
        error = null;

        try {
            // Adding a longer delay to show loading state (3 seconds)
            const response = await fetch("/api/products?delay=3000");

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            products = data.products;
            timestamp = data.timestamp;
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred";
        } finally {
            isLoading = false;
        }
    }

    function retryLoading() {
        loadProducts();
    }

    // Load products when component mounts
    onMount(() => {
        loadProducts();
    });
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-4">
        Client-side Data Loading
    </h1>

    {#if timestamp}
        <p class="text-center text-gray-600 mb-6">
            Data fetched at: {new Date(timestamp).toLocaleTimeString()}
        </p>
    {/if}

    <!-- Loading state -->
    {#if isLoading}
        <div class="flex flex-col items-center justify-center p-8">
            <div
                class="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"
                role="status"
                aria-label="Loading"
            ></div>
            <p class="text-gray-600">Loading products...</p>
        </div>
        <!-- Error state -->
    {:else if error}
        <div
            class="bg-red-50 border border-red-200 rounded-lg p-6 my-8 max-w-md mx-auto"
        >
            <h2 class="text-red-700 font-bold text-lg mb-2">
                Error Loading Data
            </h2>
            <p class="text-red-600 mb-4">{error}</p>
            <button
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                onclick={retryLoading}
                aria-label="Retry loading data"
            >
                Try Again
            </button>
        </div>
        <!-- Success state with data -->
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each products as product (product.id)}
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
                        <h2 class="text-xl font-semibold mb-2">
                            {product.name}
                        </h2>
                        <p class="text-gray-600 mb-4">{product.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xl font-bold"
                                >${product.price.toFixed(2)}</span
                            >
                            <button
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                aria-label={`Add ${product.name} to cart`}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="flex justify-center mt-6">
            <button
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                onclick={loadProducts}
                aria-label="Refresh product data"
            >
                Refresh Data
            </button>
        </div>
    {/if}
</div>
