import type { PageServerLoad } from './$types';
import {
    ServerPerformanceMetrics,
    trackExternalRequest
} from '$lib/server/ServerPerformanceMetrics';

export const load: PageServerLoad = async ({ fetch }) => {

    // Create a new server performance metrics instance
    const metrics = new ServerPerformanceMetrics();

    try {
        // Track API data fetching with detailed metrics
        const random = await trackExternalRequest(
            metrics,
            '/api/test',
            'GET',
            async () => {
                // Fetch data from our test endpoint
                const response = await fetch('/api/test');

                // Handle non-2xx responses
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status}`);
                }

                // Parse the JSON response
                return await response.json();
            }
        );
        // Complete all measurements
        metrics.complete();

        // Return data for the page, including detailed metrics
        return {
            random,
            // Include the old properties for backward compatibility
            serverRenderStart: metrics.serverRenderStart,
            serverRenderEnd: metrics.serverRenderEnd,
            // Include the new detailed metrics
            serverMetrics: metrics.toJSON(),
            error: null
        };
    } catch (err) {
        // End any current phase
        metrics.endPhase();

        // Record error phase
        metrics.startPhase('error-handling');

        // Complete the metrics
        metrics.complete();

        // Return error information instead of throwing
        // This allows us to handle the error gracefully in the page
        return {
            random: null,
            // Include the old properties for backward compatibility
            serverRenderStart: metrics.serverRenderStart,
            serverRenderEnd: metrics.serverRenderEnd,
            // Include the new detailed metrics
            serverMetrics: metrics.toJSON(),
            error: err instanceof Error ? err.message : 'An unknown error occurred'
        };
    }
};
