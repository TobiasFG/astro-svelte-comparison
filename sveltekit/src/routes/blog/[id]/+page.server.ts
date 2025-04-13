// Enable prerendering for dynamic blog posts

// Fetch blog posts from an API or database
export async function load({ params }) {
    try {
        // In a real app, this would be an API call or database query
        // For this demo, we're simulating a fetch from an API
        // Replace this with your actual data fetching logic
        const blogPosts = [
            {
                id: "1",
                title: "Understanding SvelteKit Prerendering",
                date: "April 10, 2025",
                number: crypto.randomUUID(),
                author: "Svelte Developer",
                summary: "Learn how SvelteKit can prerender your pages for optimal performance and SEO benefits.",
                content: `
                    <p>SvelteKit offers powerful prerendering capabilities that generate static HTML at build time. This improves page load times, enhances SEO, and reduces server load. Prerendered pages work without JavaScript enabled, improving accessibility and performance across all devices.</p>
                    
                    <h2>How Prerendering Works</h2>
                    <p>At build time, SvelteKit executes your page's load function and renders the component to HTML. This means the server doesn't need to dynamically render the page for each visitor - it simply serves the pre-generated HTML.</p>
                    
                    <h2>Benefits of Prerendering</h2>
                    <ul>
                        <li>Improved page load speed</li>
                        <li>Better SEO rankings</li>
                        <li>Reduced server load</li>
                        <li>Works with JavaScript disabled</li>
                        <li>Better Core Web Vitals scores</li>
                    </ul>
                    
                    <h2>When to Use Prerendering</h2>
                    <p>Prerendering is ideal for content that doesn't change frequently and doesn't need to be personalized for each user. Blog posts, documentation pages, and marketing content are perfect candidates for prerendering.</p>
                `
            },
            {
                id: "2",
                title: "Building with Tailwind CSS and Svelte",
                date: "April 5, 2025",
                number: crypto.randomUUID(),
                author: "CSS Expert",
                summary: "Discover how Tailwind CSS and Svelte complement each other for rapid UI development.",
                content: `
                    <p>The combination of Svelte's reactivity and Tailwind's utility-first approach creates an incredibly efficient development experience. With minimal boilerplate and maximum flexibility, you can build beautiful interfaces faster than ever.</p>
                    
                    <h2>Why Tailwind Works Well with Svelte</h2>
                    <p>Svelte's component-based architecture aligns perfectly with Tailwind's utility classes. You get all the benefits of component isolation while leveraging Tailwind's design system for consistent styling.</p>
                    
                    <h2>Performance Optimizations</h2>
                    <p>When building for production, unused Tailwind classes are automatically purged, resulting in minimal CSS. Combined with Svelte's compile-time optimizations, you get incredibly lean output.</p>
                    
                    <h2>Responsive Design Made Simple</h2>
                    <p>Tailwind's responsive modifiers make it easy to build interfaces that work across all screen sizes. No more media query headaches!</p>
                `
            },
            {
                id: "3",
                title: "Accessibility Best Practices in Web Development",
                date: "March 28, 2025",
                number: crypto.randomUUID(),
                author: "Accessibility Advocate",
                summary: "Essential techniques for creating accessible web applications for all users.",
                content: `
                    <p>Building accessible websites isn't just about compliance—it's about creating inclusive experiences. From proper semantic HTML to keyboard navigation and ARIA attributes, this post covers fundamental techniques that benefit all users regardless of ability.</p>
                    
                    <h2>Semantic HTML: The Foundation</h2>
                    <p>Using the right HTML elements for their intended purpose provides a strong foundation for accessibility. Screen readers and assistive technologies rely on proper semantics.</p>
                    
                    <h2>Focus Management</h2>
                    <p>Ensuring all interactive elements can be accessed and operated with a keyboard is essential. Custom components should maintain focus states and follow expected keyboard interactions.</p>
                    
                    <h2>ARIA When Necessary</h2>
                    <p>ARIA attributes help bridge accessibility gaps, but should only be used when HTML semantics aren't sufficient. Remember: "No ARIA is better than bad ARIA."</p>
                    
                    <h2>Color Contrast and Visual Cues</h2>
                    <p>Maintaining sufficient color contrast and not relying solely on color to convey information ensures your content is perceivable by users with various visual abilities.</p>
                `
            }
        ];

        const post = blogPosts.find(p => p.id === params.id);
        if (!post) {
            throw new Error('Post not found');
        }

        return {
            post,
            // Add a revalidate timestamp to track when the data was last fetched
            lastFetched: new Date()
        };
    } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
    }
}
