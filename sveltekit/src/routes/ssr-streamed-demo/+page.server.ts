import type { RandomData } from '../api/test/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    // We'll create a promise that will resolve with the data from our API
    // This allows streaming the data to the client while the rest of the page is interactive
    const dataPromise: Promise<RandomData> = new Promise(async (resolve, reject) => {
        try {
            // Fetch data from our test endpoint
            const response = await fetch('/api/test');

            // Handle non-2xx responses
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();

            // Resolve the promise with our data
            resolve(data);
        } catch (err) {
            // Reject with the error
            reject(err);
        }
    });

    // Return an object with our streamed data promise
    // SvelteKit will handle streaming this to the client
    return {
        // This is a promise that will be streamed to the client
        streamedData: dataPromise,

        // This data is immediately available
        pageInfo: {
            title: "SSR with Streaming",
            renderedAt: new Date().toLocaleTimeString()
        }
    };
};
