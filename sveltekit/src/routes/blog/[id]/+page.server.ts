// Enable prerendering for dynamic blog posts
export const prerender = true;

// Generate routes for each blog post during build time
export async function entries() {
    // This would typically come from a CMS, API, or database
    // For demonstration, we're hardcoding the IDs
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' }
    ];
}
