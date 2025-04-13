import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Server-side data loading with streaming and error handling
 * Uses Svelte 5 runes approach with enhanced features
 */
export const load = (async ({ fetch, depends, setHeaders }) => {
    // Register a dependency on app:products so we can invalidate it
    depends('app:products');

    try {
        // Server-side data fetching
        const productPromise = fetch('/api/products?delay=2000')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load products: ${response.status}`);
                }

                // Set cache headers based on the API response for optimal caching
                setHeaders({
                    'cache-control': 'max-age=60, stale-while-revalidate=300'
                });

                return response.json();
            });        // Get the data first to avoid streaming, as Svelte 5 runes may not properly handle streamed data
        const data = await productPromise;

        // Return the resolved data
        return {
            products: data.products,
            timestamp: data.timestamp,

            // Include additional metadata
            lastUpdated: new Date().toISOString()
        };
    } catch (err) {
        // Handle errors properly with appropriate status code
        console.error('Error loading products:', err);
        error(500, {
            message: 'Failed to load products'
        });
    }
}) satisfies PageServerLoad;
