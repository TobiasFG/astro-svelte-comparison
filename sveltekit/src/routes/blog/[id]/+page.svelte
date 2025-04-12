<script lang="ts">
    // Import types if needed
    import { page } from '$app/stores';
    import { error } from '@sveltejs/kit';
    
    // Static blog posts data - would typically come from a CMS or API
    // but for prerendering demonstration, we'll define it here
    const blogPosts = [
        {
            id: "1",
            title: "Understanding SvelteKit Prerendering",
            date: "April 10, 2025",
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
    
    // Get the current post ID from the URL
    const postId = $page.params.id;
    
    // Find the current post
    const post = blogPosts.find(p => p.id === postId);
    
    // If post doesn't exist, throw a 404 error
    if (!post) {
        error(404, 'Post not found');
    }
</script>

<svelte:head>
    <title>{post.title} | SvelteKit Prerendering Demo</title>
    <meta name="description" content={post.summary} />
    <!-- Open Graph tags for better social sharing -->
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.summary} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={post.date} />
    <meta property="article:author" content={post.author} />
</svelte:head>

<main class="container mx-auto px-4 py-12">
    <article class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-8">
            <!-- Back button -->
            <a href="/blog" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all posts
            </a>
            
            <!-- Post header -->
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <div class="flex items-center text-gray-600">
                    <time datetime={post.date} class="mr-6">{post.date}</time>
                    <span>By {post.author}</span>
                </div>
            </header>
            
            <!-- Post content -->
            <div class="prose prose-lg max-w-none text-gray-700">
                {@html post.content}
            </div>
        </div>
    </article>
</main>
