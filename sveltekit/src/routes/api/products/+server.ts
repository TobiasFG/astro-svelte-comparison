import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock product data
const products = [
    {
        id: 1,
        name: 'Premium Headphones',
        price: 159.99,
        description: 'High-quality wireless headphones with noise cancellation',
        image: 'https://picsum.photos/seed/headphones/300/300'
    },
    {
        id: 2,
        name: 'Smartwatch Pro',
        price: 249.99,
        description: 'Advanced smartwatch with health monitoring features',
        image: 'https://picsum.photos/seed/smartwatch/300/300'
    },
    {
        id: 3,
        name: 'Wireless Charging Pad',
        price: 39.99,
        description: 'Fast wireless charging for all compatible devices',
        image: 'https://picsum.photos/seed/charger/300/300'
    },
    {
        id: 4,
        name: 'Ultra HD Camera',
        price: 499.99,
        description: 'Professional-grade camera with 4K video recording',
        image: 'https://picsum.photos/seed/camera/300/300'
    },
    {
        id: 5,
        name: 'Portable Power Bank',
        price: 69.99,
        description: '20,000mAh power bank with fast charging capabilities',
        image: 'https://picsum.photos/seed/powerbank/300/300'
    }
];

export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
};

export const GET: RequestHandler = async ({ url }) => {
    // Parse query parameters
    const delay = Number(url.searchParams.get('delay') || '1000');

    // Simulate network latency with a delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Return mock product data
    return json({
        products,
        timestamp: new Date()
    });
};
