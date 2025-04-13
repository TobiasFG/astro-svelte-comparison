<script lang="ts">
    // Using Svelte 5's runes mode
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";

    // Get data from the page's server load function
    let { data }: PageProps = $props();
    // Destructure the post data
    let { post, lastFetched } = data;

    // Track if content is fresh or stale
    let isFresh = $state(true);

    // Check for content freshness after component mounts
    onMount(() => {
        const checkFreshness = () => {
            const fetchTime = new Date(lastFetched).getTime();
            const currentTime = new Date().getTime();
            // Consider content stale after 5 minutes (300000 ms)
            isFresh = currentTime - fetchTime < 1000;
        };

        // Check freshness immediately and then every minute
        checkFreshness();
        const interval = setInterval(checkFreshness, 1000);

        return () => {
            clearInterval(interval);
        };
    });
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
    <!-- Content freshness indicator -->
    {#if !isFresh}
        <div
            class="max-w-3xl mx-auto mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md"
        >
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg
                        class="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                        This content may be outdated. <button
                            class="underline font-medium hover:text-yellow-900"
                            onclick={() => window.location.reload()}
                            >Refresh</button
                        > to see the latest version.
                    </p>
                </div>
            </div>
        </div>
    {/if}

    <article
        class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
        <div class="p-8">
            <!-- Back button -->
            <a
                href="/blog"
                class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to all posts
            </a>

            <!-- Post header -->
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>
                <div class="flex items-center text-gray-600">
                    <time datetime={post.date} class="mr-6">{post.date}</time>
                    <span>By {post.author}</span>
                </div>
            </header>

            <!-- Post content -->
            <div class="prose prose-lg max-w-none text-gray-700">
                {@html post.content}
            </div>

            <!-- Last updated info -->
            <div
                class="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500"
            >
                <p>Last updated: {new Date(lastFetched).toLocaleString()}</p>
                <p>id: {post.number}</p>
            </div>
        </div>
    </article>
</main>
