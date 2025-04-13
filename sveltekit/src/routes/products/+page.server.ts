import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    // Server-side data fetching with a 2 second delay
    const response = await fetch('/api/products?delay=2000');
    const data = await response.json();

    return {
        products: data.products,
        timestamp: data.timestamp
    };
};
