import type { RandomData } from '../api/test/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {


    try {
        // Track API data fetching with detailed metrics
        const response = await fetch('/api/test?delay=3000');

        // Handle non-2xx responses
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        // Return data for the page, including detailed metrics
        return {
            random: await response.json() as RandomData,
            error: null
        };
    } catch (err) {
        // Return error information instead of throwing
        // This allows us to handle the error gracefully in the page
        return {
            random: null,
            error: err instanceof Error ? err.message : 'An unknown error occurred'
        };
    }
};
