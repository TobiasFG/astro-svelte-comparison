import { type RequestHandler } from '@sveltejs/kit';

export type RandomData = {
    id: string;
    title: string;
    date: string;
    number: string;
};

export const GET: RequestHandler = async ({ url }) => {

    const delayDuration = parseInt(url.searchParams.get('delay') || '0');
    const randomUUID = crypto.randomUUID();
    const date = new Date();
    const random = {
        id: randomUUID,
        title: `Random Title ${randomUUID}`,
        date: date.toISOString(),
        number: randomUUID,
    }

    // Make a fake delay of 20 seconds to simulate a slow network
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    return await delay(delayDuration).then(() => {
        return new Response(JSON.stringify(random), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    });
};