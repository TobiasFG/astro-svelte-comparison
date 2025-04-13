import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Record when the data loading started
        const startTime = Date.now();

        // Fetch data from our test endpoint
        const response = await fetch('/api/test');

        // Handle non-2xx responses
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        // Parse the JSON response
        const random = await response.json();

        // Calculate how long it took to load the data
        const endTime = Date.now();
        const loadTime = endTime - startTime;

        // Return data for the page
        return {
            random,
            renderedAt: new Date().toLocaleTimeString(),
            loadTime,
            error: null
        };
    } catch (err) {
        // Return error information instead of throwing
        // This allows us to handle the error gracefully in the page
        return {
            random: null,
            renderedAt: new Date().toLocaleTimeString(),
            loadTime: null,
            error: err instanceof Error ? err.message : 'An unknown error occurred'
        };
    }
};
