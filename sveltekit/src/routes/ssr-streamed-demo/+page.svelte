<script lang="ts">
	import PerformanceTracker from '$lib/components/PerformanceTracker/PerformanceTracker.svelte';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();

	// Track when streaming started on the client
	let streamingStartTime = $state(new Date());

	// Track when streaming completes on the client
	let streamingCompleteTime = $state<Date | null>(null);
	let streamingDuration = $state<number | null>(null);

	// Track if data has been loaded (to avoid multiple effect triggers)
	let dataLoaded = $state(false);

	// Use $effect to react when streamed data is available
	$effect(() => {
		if (!dataLoaded && data.streamedData instanceof Promise) {
			data.streamedData
				.then(() => {
					streamingCompleteTime = new Date();
					streamingDuration = streamingCompleteTime.getTime() - streamingStartTime.getTime();
					dataLoaded = true;
				})
				.catch(() => {
					// Handle error case - still record timing
					streamingCompleteTime = new Date();
					streamingDuration = streamingCompleteTime.getTime() - streamingStartTime.getTime();
					dataLoaded = true;
				});
		}
	});
</script>

<svelte:head>
	<title>SSR with Streaming Demo | SvelteKit</title>
	<meta
		name="description"
		content="Demonstration of server-side rendering with streaming in SvelteKit"
	/>
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

		<h1 class="mb-2 text-3xl font-bold">SSR with Streaming</h1>
		<p class="mb-8 text-gray-600">Page renders immediately while data streams in gradually</p>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Demo</h2>
				<a
					href="/ssr-streamed-demo"
					data-sveltekit-replacestate
					data-sveltekit-noscroll
					data-sveltekit-preload-data
					data-sveltekit-preload-code
					data-sveltekit-reload
					class="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
				>
					Refresh Page
				</a>
			</div>

			<div class="mb-6 rounded-md border border-purple-100 bg-purple-50 p-4">
				<h3 class="mb-2 flex items-center gap-2 font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-purple-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					How This Works
				</h3>
				<p class="text-sm text-gray-700">
					This page is immediately interactive while the data loads in the background. Unlike
					traditional SSR, you don't have to wait for all data before seeing the page. The HTML
					streams incrementally to the browser.
				</p>
				<p class="mt-2 text-sm font-medium text-purple-700">
					Page rendered at: {data.pageInfo.renderedAt}
				</p>
			</div>

			{#await data.streamedData}
				<div
					class="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-purple-200 py-12"
					role="status"
					aria-live="polite"
				>
					<div
						class="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"
						aria-hidden="true"
					></div>
					<div class="text-center">
						<p class="font-medium text-gray-700">Streaming data from server...</p>
						<p class="mt-1 text-sm text-gray-500">
							Started at: <time dateTime={streamingStartTime.toISOString()}
								>{streamingStartTime.toLocaleTimeString()}</time
							>
						</p>
						<div class="mx-auto mt-4 w-full max-w-xs">
							<div class="h-1.5 overflow-hidden rounded-full bg-gray-200">
								<div class="animate-pulse-width h-full rounded-full bg-purple-500"></div>
							</div>
						</div>
						<p class="mt-3 text-sm font-medium text-purple-600">
							Notice you can interact with the page while data loads!
						</p>
					</div>
				</div>
			{:then random}
				<div class="animate-fade-in space-y-6">
					<div class="rounded-md bg-gray-50 p-6 shadow-sm">
						<h3 class="mb-4 text-lg font-medium text-gray-800">Random Data:</h3>
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-gray-500">ID</p>
								<p class="break-all rounded bg-gray-100 p-2 font-mono text-sm">
									{random.id}
								</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-gray-500">Title</p>
								<p class="font-medium">{random.title}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-gray-500">Date</p>
								<p>
									<time dateTime={new Date(random.date).toISOString()}>
										{new Date(random.date).toLocaleString()}
									</time>
								</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-gray-500">Number</p>
								<p class="font-mono">{random.number}</p>
							</div>
						</div>
					</div>
				</div>
			{:catch error}
				<div
					class="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 p-4 shadow-sm"
					role="alert"
					aria-labelledby="streaming-error-heading"
				>
					<div class="flex items-center">
						<svg
							class="mr-3 h-6 w-6 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h3 id="streaming-error-heading" class="font-medium text-red-700">
							Error: {error.message || 'Failed to stream data'}
						</h3>
					</div>
					<div class="mt-3 space-y-2">
						{#if streamingDuration}
							<p class="text-sm text-red-600">
								Error occurred after {streamingDuration}ms of streaming
							</p>
						{/if}
						<p class="text-sm text-gray-600">
							The server was unable to complete the streaming operation. This demonstrates how SSR
							streaming handles errors - the page is still interactive and usable even when data
							streaming fails.
						</p>
						<a
							href="/ssr-streamed-demo"
							class="mt-2 inline-block rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							aria-label="Retry loading streaming data"
						>
							Retry Streaming
						</a>
					</div>
				</div>
			{/await}

			<PerformanceTracker />
		</div>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<h2 class="text-xl font-semibold">About SSR with Streaming</h2>

			<div>
				<h3 class="mb-2 text-lg font-medium">How it Works</h3>
				<p class="mb-3 text-gray-600">
					SSR with streaming combines the best of server rendering and client interactivity. The
					server starts sending HTML immediately with a skeleton of the page, while data-dependent
					parts are streamed in later as they become available. This provides a fast initial render
					while allowing slow data operations to complete later.
				</p>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Benefits</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Fast Initial Page Load:</span>
						Shows UI skeleton immediately
					</li>
					<li>
						<span class="font-medium">Progressive Loading:</span> Content streams in as it becomes available
					</li>
					<li>
						<span class="font-medium">Early Interactivity:</span> Users can interact with parts of the
						page before all data loads
					</li>
					<li>
						<span class="font-medium">Good for SEO:</span> Search engines see most content in the initial
						HTML
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Drawbacks</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Complex Implementation:</span>
						More difficult to reason about than simple SSR
					</li>
					<li>
						<span class="font-medium">Layout Shifts:</span> Content can shift as streaming data arrives
					</li>
					<li>
						<span class="font-medium">Error Handling:</span> Requires careful error boundaries for streamed
						content
					</li>
					<li>
						<span class="font-medium">Server Resources:</span> Keeps connections open longer than regular
						SSR
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Best For</h3>
				<ul class="list-disc space-y-1 pl-6 text-gray-600">
					<li>Pages with a mix of static and dynamic content</li>
					<li>UIs where some data takes longer to fetch than others</li>
					<li>Applications that need good SEO but also fast interactivity</li>
					<li>Improving user experience on slower connections</li>
				</ul>
			</div>
		</div>
	</div>
</div>
