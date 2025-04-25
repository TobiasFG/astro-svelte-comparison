import type { PageServerLoad } from './$types';

// Set prerender to true to make SvelteKit build this as a static page
export const prerender = true;

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch data from our test endpoint - this will only happen at build time
        const response = await fetch('/api/test?delay=3000');

        // Handle non-2xx responses
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        // Parse the JSON response
        const random = await response.json();

        // Return data for the page
        return {
            random,
            renderedAt: new Date().toLocaleTimeString(),
            buildDate: new Date().toISOString(),
            error: null
        };
    } catch (err) {
        // Return error information
        return {
            random: null,
            renderedAt: new Date().toLocaleTimeString(),
            buildDate: new Date().toISOString(),
            error: err instanceof Error ? err.message : 'An unknown error occurred'
        };
    }
};
