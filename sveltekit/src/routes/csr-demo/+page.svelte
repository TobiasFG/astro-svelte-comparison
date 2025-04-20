<script lang="ts">
	import { onMount } from 'svelte';
	import type { RandomData } from '../api/test/+server';
	import PerformanceTracker from '$lib/components/PerformanceTracker/PerformanceTracker.svelte';

	let refreshCount = $state(0);

	// State management using Svelte 5 runes
	let data = $state<RandomData | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let loadStart = $state<Date | null>(null);
	let loadEnd = $state<Date | null>(null);
	let loadTime = $state<number | null>(null);

	// Track metrics for analytics
	let metrics = $state({
		fetchAttempts: 0,
		successfulFetches: 0,
		failedFetches: 0,
		averageLoadTime: 0
	});

	/**
	 * Function to fetch data - properly typed with error handling
	 * and performance tracking
	 */
	async function fetchData() {
		loading = true;
		error = null;
		loadStart = new Date();
		loadTime = null;
		refreshCount++;
		metrics.fetchAttempts++;

		try {
			// Use AbortController for better request management
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

			const response = await fetch('/api/test', {
				signal: controller.signal,
				headers: {
					Accept: 'application/json'
				}
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			data = await response.json();
			loadEnd = new Date();
			loadTime = loadEnd.getTime() - loadStart.getTime();

			// Update success metrics
			metrics.successfulFetches++;
			metrics.averageLoadTime =
				(metrics.averageLoadTime * (metrics.successfulFetches - 1) + loadTime) /
				metrics.successfulFetches;
		} catch (err) {
			// Proper error handling with improved type checking
			error =
				err instanceof Error
					? err.message
					: err instanceof DOMException && err.name === 'AbortError'
						? 'Request timed out'
						: 'An unknown error occurred';

			loadEnd = new Date();
			loadTime = loadEnd?.getTime() - loadStart.getTime();
			metrics.failedFetches++;
		} finally {
			loading = false;
		}
	}

	// Create a derived state for formatted metrics
	const formattedAverageTime = $derived(
		metrics.successfulFetches > 0 ? `${metrics.averageLoadTime.toFixed(0)}ms` : 'N/A'
	);

	// Fetch data on component mount and clean up any side effects
	onMount(() => {
		fetchData();

		// Return cleanup function
		return () => {
			// Any cleanup needed when component unmounts
		};
	});
</script>

<svelte:head>
	<title>Client-Side Rendering Demo | SvelteKit</title>
	<meta name="description" content="Demonstration of client-side rendering in SvelteKit" />
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

		<h1 class="mb-2 text-3xl font-bold">Client-Side Rendering</h1>
		<p class="mb-8 text-gray-600">Data is fetched by the browser after the component mounts</p>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Demo</h2>
				<div class="flex items-center gap-3">
					{#if refreshCount > 0}
						<span
							class="hidden text-xs text-gray-500 sm:inline-block"
							aria-live="polite"
							aria-atomic="true"
						>
							Refreshed {refreshCount} time{refreshCount !== 1 ? 's' : ''}
						</span>
					{/if}
					<button
						class="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
						onclick={fetchData}
						disabled={loading}
						aria-busy={loading}
						aria-label={loading ? 'Refreshing data...' : 'Refresh data'}
					>
						<span class="flex items-center gap-2">
							{#if loading}
								<svg
									class="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							{/if}
							{loading ? 'Refreshing...' : 'Refresh Data'}
						</span>
					</button>
				</div>
			</div>

			<div aria-live="polite" class="relative">
				{#if loading}
					<div
						class="flex flex-col items-center justify-center space-y-3 rounded-md bg-white py-12 transition-opacity duration-300"
						role="status"
					>
						<div
							class="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
							aria-hidden="true"
						></div>
						<p class="font-medium text-gray-700">Loading data from API...</p>
						{#if loadStart}
							<p class="text-sm text-gray-500">
								Loading started at: {loadStart.toLocaleTimeString()}
							</p>
						{/if}
					</div>
				{:else if error}
					<div
						class="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 p-4 shadow-sm"
						role="alert"
						aria-labelledby="error-heading"
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
							<h3 id="error-heading" class="font-medium text-red-700">
								Error: {error}
							</h3>
						</div>
						<div class="mt-3 space-y-2">
							{#if loadTime}
								<p class="text-sm text-red-600">
									Error occurred after {loadTime}ms
								</p>
							{/if}
							<button
								class="rounded text-sm text-red-700 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								onclick={fetchData}
							>
								Try again
							</button>
						</div>
					</div>
				{:else if data}
					<div class="animate-fadeIn space-y-6">
						<div class="rounded-md bg-gray-50 p-6 shadow-sm">
							<h3 class="mb-4 text-lg font-medium text-gray-800">Random Data:</h3>
							<div class="grid gap-4 md:grid-cols-2">
								<div>
									<p class="mb-1 text-sm text-gray-500">ID</p>
									<p class="break-all rounded bg-gray-100 p-2 font-mono text-sm">
										{data.id}
									</p>
								</div>
								<div>
									<p class="mb-1 text-sm text-gray-500">Title</p>
									<p class="font-medium">{data.title}</p>
								</div>
								<div>
									<p class="mb-1 text-sm text-gray-500">Date</p>
									<p>
										<time datetime={new Date(data.date).toISOString()}>
											{new Date(data.date).toLocaleString()}
										</time>
									</p>
								</div>
								<div>
									<p class="mb-1 text-sm text-gray-500">Number</p>
									<p class="font-mono">{data.number}</p>
								</div>
							</div>
						</div>

						<PerformanceTracker />
					</div>
				{/if}
			</div>
		</div>

		<div class="space-y-4 rounded-lg border bg-gray-50 p-6">
			<h2 class="text-xl font-semibold">About Client-Side Rendering</h2>

			<div>
				<h3 class="mb-2 text-lg font-medium">How it Works</h3>
				<p class="mb-3 text-gray-600">
					In client-side rendering (CSR), the initial HTML sent from the server contains minimal
					markup. After the JavaScript bundle loads in the browser, the component mounts and
					triggers a fetch request to get the data. The UI is then rendered entirely in the browser.
				</p>
				<pre class="overflow-x-auto rounded-md bg-gray-800 p-4 text-sm text-gray-200"><code
					></code></pre>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Benefits</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Dynamic Updates:</span> Can refresh data without reloading the
						page
					</li>
					<li>
						<span class="font-medium">Reduced Server Load:</span> Data processing happens in the browser
					</li>
					<li>
						<span class="font-medium">Rich Interactivity:</span> Great for highly interactive applications
					</li>
					<li>
						<span class="font-medium">Caching Control:</span> Can implement sophisticated client-side
						caching
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Drawbacks</h3>
				<ul class="list-disc space-y-2 pl-6 text-gray-600">
					<li>
						<span class="font-medium">Initial Load:</span> Users see a loading state before content appears
					</li>
					<li>
						<span class="font-medium">SEO Limitations:</span> Search engines may not see the full content
					</li>
					<li>
						<span class="font-medium">JavaScript Dependency:</span> Requires JavaScript to function
					</li>
					<li>
						<span class="font-medium">Network Waterfall:</span> Multiple round-trips needed (HTML → JS
						→ API data)
					</li>
				</ul>
			</div>

			<div class="mt-6">
				<h3 class="mb-2 text-lg font-medium">Best For</h3>
				<ul class="list-disc space-y-1 pl-6 text-gray-600">
					<li>Dashboards and admin interfaces</li>
					<li>Highly interactive applications</li>
					<li>Real-time data that updates frequently</li>
					<li>User-specific content after authentication</li>
				</ul>
			</div>
		</div>
	</div>
</div>
