<script lang="ts">
	import PerformanceTracker from '$lib/components/PerformanceTracker/PerformanceTracker.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// Use our performance tracking hook with the new class-based implementation
</script>

<svelte:head>
	<title>Server-Side Rendering Demo | SvelteKit</title>
	<meta name="description" content="Demonstration of server-side rendering in SvelteKit" />
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

		<h1 class="mb-2 text-3xl font-bold">Server-Side Rendering</h1>
		<p class="mb-8 text-gray-600">
			Data is fetched on the server before the HTML is sent to the browser
		</p>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Demo</h2>
				<a
					href="/ssr-demo"
					data-sveltekit-reload
					class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Refresh Page
				</a>
			</div>

			{#if data?.error}
				<div class="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 p-4" role="alert">
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
						<h3 class="font-medium text-red-700">
							Error: {data.error}
						</h3>
					</div>
					<p class="mt-2 text-sm text-red-600">
						This error occurred on the server during page rendering. Try refreshing the page.
					</p>
				</div>
			{:else if data.random}
				<div class="space-y-6">
					<div class="rounded-md bg-gray-50 p-6 shadow-sm">
						<h3 class="mb-4 text-lg font-medium text-gray-800">Random Data:</h3>
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-gray-500">ID</p>
								<p class="break-all rounded bg-gray-100 p-2 font-mono text-sm">
									{data.random.id}
								</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-gray-500">Title</p>
								<p class="font-medium">{data.random.title}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-gray-500">Date</p>
								<p>
									<time datetime={new Date(data.random.date).toISOString()}>
										{new Date(data.random.date).toLocaleString()}
									</time>
								</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-gray-500">Number</p>
								<p class="font-mono">{data.random.number}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<PerformanceTracker />
		</div>

		<div class={['mb-8 rounded-lg bg-white p-6 shadow-lg']}>
			<h2 class="text-xl font-semibold">About Server-Side Rendering</h2>

			<div>
				<h3 class="mb-2 text-lg font-medium">How it Works</h3>
				<p class="mb-3 text-gray-600">
					In server-side rendering (SSR), the server fetches all required data and generates the
					complete HTML before sending it to the browser. The page is fully rendered when it arrives
					at the client, providing immediate content display.
				</p>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Benefits</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Immediate Content Display:</span> No loading state for initial
						page load
					</li>
					<li>
						<span class="font-medium">Better SEO:</span> Search engines see the full content in the HTML
					</li>
					<li>
						<span class="font-medium">Works Without JavaScript:</span> Core content is available even
						if JS fails
					</li>
					<li>
						<span class="font-medium">Improved Performance:</span> Fewer network requests for initial
						load
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Drawbacks</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Server Load:</span> Requires more server processing power
					</li>
					<li>
						<span class="font-medium">TTFB (Time To First Byte):</span> May be slower as server must
						process before responding
					</li>
					<li>
						<span class="font-medium">Full Page Reloads:</span> Data refreshes typically require full
						page reload
					</li>
					<li>
						<span class="font-medium">Server/Client State Sync:</span> Can be tricky to manage state
						between server and client
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Best For</h3>
				<ul class="list-disc space-y-1 pl-6 text-gray-600">
					<li>Content-focused websites where SEO is important</li>
					<li>Pages that don't need frequent client-side updates</li>
					<li>Experiences where immediate content display is critical</li>
					<li>Applications that need to work well without JavaScript</li>
				</ul>
			</div>
		</div>
	</div>
</div>
