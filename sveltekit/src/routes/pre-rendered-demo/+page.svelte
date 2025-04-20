<script lang="ts">
	import PerformanceTracker from '$lib/components/PerformanceTracker/PerformanceTracker.svelte';
	import type { RandomData } from '../api/test/+server';

	// Use Svelte 5 runes for page data
	const { data } = $props<{
		data: {
			random?: RandomData;
			renderedAt?: string;
			buildDate?: string;
			error?: string | null;
		};
	}>();
</script>

<svelte:head>
	<title>Pre-rendered Static Demo | SvelteKit</title>
	<meta name="description" content="Demonstration of pre-rendered static content in SvelteKit" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-8">
			<a href="/" class="flex items-center gap-1 text-blue-500 hover:underline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Home
			</a>
		</div>

		<h1 class="mb-2 text-3xl font-bold">Pre-rendered Static</h1>
		<p class="mb-8 text-gray-600">Content generated at build time, not when users visit the page</p>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Demo</h2>
				<a
					href="/pre-rendered-demo"
					class="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
				>
					Reload Page
				</a>
			</div>

			<div class="mb-6 rounded-md border border-yellow-100 bg-yellow-50 p-4">
				<h3 class="mb-2 flex items-center gap-2 font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-yellow-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					Important Note
				</h3>
				<p class="text-sm text-gray-700">
					This page was pre-rendered at build time. The data you see was fetched once when the site
					was built, not when you loaded this page. Refreshing the page will show the same data
					because it's static HTML.
				</p>
			</div>

			{#if data?.error}
				<div class="mb-4 rounded border-l-4 border-red-500 bg-red-100 p-4">
					<div class="flex items-center">
						<svg
							class="mr-3 h-6 w-6 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p class="text-red-700">Error: {data.error}</p>
					</div>
					<p class="mt-2 text-sm text-red-600">This error occurred at build time.</p>
				</div>
			{:else if data?.random}
				<div class="space-y-6">
					<div class="rounded-md bg-gray-50 p-6">
						<h3 class="mb-4 text-lg font-medium">Pre-rendered Data:</h3>
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<p class="text-sm text-gray-500">ID</p>
								<p class="rounded bg-gray-100 p-2 font-mono">
									{data.random.id}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Title</p>
								<p class="font-medium">{data.random.title}</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Date</p>
								<p>
									{new Date(data.random.date).toLocaleString()}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Number</p>
								<p class="font-mono">{data.random.number}</p>
							</div>
						</div>
					</div>

					<PerformanceTracker />
				</div>
			{/if}
		</div>

		<div class="smb-8 rounded-lg bg-white p-6 shadow-lg">
			<h2 class="text-xl font-semibold">About Pre-rendering</h2>

			<div>
				<h3 class="mb-2 text-lg font-medium">How it Works</h3>
				<p class="mb-3 text-gray-600">
					Pre-rendering generates static HTML files at build time instead of on-demand. When you
					build your site, SvelteKit runs the load functions once, renders the pages, and produces
					HTML files that can be served without any server processing. This approach is also known
					as Static Site Generation (SSG).
				</p>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Benefits</h3>
				<ul class="spaces-y-2 list-disc pl-6 text-gray-600">
					<li>
						<span class="font-medium">Ultra-Fast Performance:</span>
						Pages are pre-built and can be served from a CDN
					</li>
					<li>
						<span class="font-medium">Reduced Server Load:</span> No server processing required at runtime
					</li>
					<li>
						<span class="font-medium">Excellent for SEO:</span> Content is immediately available in the
						HTML
					</li>
					<li>
						<span class="font-medium">Works Without JavaScript:</span> Core content is available in the
						static HTML
					</li>
					<li>
						<span class="font-medium">High Reliability:</span> Less that can go wrong at runtime
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Drawbacks</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Static Content:</span> Data is fixed at build time
					</li>
					<li>
						<span class="font-medium">Build Time:</span> Can be slow for large sites with many pages
					</li>
					<li>
						<span class="font-medium">Dynamic Content Issues:</span>
						Not suitable for highly personalized or frequently changing content
					</li>
					<li>
						<span class="font-medium">Rebuild Required:</span> Site must be rebuilt to update content
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Best For</h3>
				<ul class="list-disc space-y-1 pl-6 text-gray-600">
					<li>Marketing websites</li>
					<li>Blogs and documentation sites</li>
					<li>Content that doesn't change frequently</li>
					<li>Sites where performance is critical</li>
					<li>Pages that don't need personalization</li>
				</ul>
			</div>
		</div>
	</div>
</div>
