<script lang="ts">
    // Static blog posts data
    const blogPosts = $state([
        {
            id: 1,
            title: "Understanding SvelteKit Prerendering",
            date: "April 10, 2025",
            summary: "Learn how SvelteKit can prerender your pages for optimal performance and SEO benefits.",
            content: "SvelteKit offers powerful prerendering capabilities that generate static HTML at build time. This improves page load times, enhances SEO, and reduces server load. Prerendered pages work without JavaScript enabled, improving accessibility and performance across all devices."
        },
        {
            id: 2,
            title: "Building with Tailwind CSS and Svelte",
            date: "April 5, 2025",
            summary: "Discover how Tailwind CSS and Svelte complement each other for rapid UI development.",
            content: "The combination of Svelte's reactivity and Tailwind's utility-first approach creates an incredibly efficient development experience. With minimal boilerplate and maximum flexibility, you can build beautiful interfaces faster than ever."
        },
        {
            id: 3,
            title: "Accessibility Best Practices in Web Development",
            date: "March 28, 2025",
            summary: "Essential techniques for creating accessible web applications for all users.",
            content: "Building accessible websites isn't just about compliance—it's about creating inclusive experiences. From proper semantic HTML to keyboard navigation and ARIA attributes, this post covers fundamental techniques that benefit all users regardless of ability."
        }
    ]);
</script>

<svelte:head>
    <title>Blog | SvelteKit Prerendering Demo</title>
    <meta name="description" content="Demonstration of SvelteKit's powerful prerendering capabilities" />
</svelte:head>

<main class="container mx-auto px-4 py-12">
    <section class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">Our Blog</h1>
        
        <div class="prose max-w-none mb-12">
            <p class="text-lg text-gray-700">
                Welcome to our blog where we share insights about web development,
                frameworks, and best practices. All these articles are statically 
                generated at build time, demonstrating SvelteKit's prerendering capabilities.
            </p>
        </div>
        
        <div class="space-y-12">
            {#each blogPosts as post}
                <article class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="p-6">
                        <span class="text-sm font-medium text-blue-600">{post.date}</span>
                        <h2 class="mt-2 text-2xl font-semibold text-gray-900 hover:text-blue-700">
                            <a href={`/blog/${post.id}`} class="focus:outline-none focus:underline">
                                {post.title}
                            </a>
                        </h2>
                        <p class="mt-3 text-base text-gray-500">
                            {post.summary}
                        </p>
                        <div class="mt-6">
                            <p class="text-gray-700">{post.content}</p>
                        </div>
                        <div class="mt-6">
                            <a href={`/blog/${post.id}`} 
                               class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                               aria-label={`Read more about ${post.title}`}>
                                Read full article
                            </a>
                        </div>
                    </div>
                </article>
            {/each}
        </div>
    </section>
</main>
