<script lang="ts">
	import { initPerformanceStore } from '$lib/stores/performance-store.svelte';
	import PerformanceTracker from './PerformanceTracker.svelte';
	import type { PageLoadMetric, SpaNavigationMetric } from '$lib/stores/performance-store.svelte';

	const store = initPerformanceStore();

	let activeTab = $state<'page-load' | 'spa-navigation'>('page-load');

	let pageLoadMetrics = $state<PageLoadMetric[]>([]);
	let spaNavigationMetrics = $state<SpaNavigationMetric[]>([]);

	// Subscribe to store changes and update local arrays
	$effect(() => {
		if (store.pageLoadMetrics?.subscribe) {
			store.pageLoadMetrics.subscribe((v: PageLoadMetric[]) => (pageLoadMetrics = v));
		}
		if (store.spaNavigationMetrics?.subscribe) {
			store.spaNavigationMetrics.subscribe(
				(v: SpaNavigationMetric[]) => (spaNavigationMetrics = v)
			);
		}
	});

	function selectTab(tab: 'page-load' | 'spa-navigation') {
		activeTab = tab;
	}

	function getPageLoadSummary(metrics: PageLoadMetric[]) {
		if (!metrics.length) return null;
		const loadTimes = metrics.map(
			(m: PageLoadMetric) => m.metrics.loadEventEnd - m.metrics.startTime
		);
		return {
			avg: loadTimes.reduce((a: number, b: number) => a + b, 0) / loadTimes.length,
			min: Math.min(...loadTimes),
			max: Math.max(...loadTimes)
		};
	}
	function getSpaNavSummary(metrics: SpaNavigationMetric[]) {
		if (!metrics.length) return null;
		const times = metrics.map((m: SpaNavigationMetric) => m.duration);
		return {
			avg: times.reduce((a: number, b: number) => a + b, 0) / times.length,
			min: Math.min(...times),
			max: Math.max(...times)
		};
	}

	const pageLoadSummary = $derived(() => getPageLoadSummary(pageLoadMetrics));
	const spaNavSummary = $derived(() => getSpaNavSummary(spaNavigationMetrics));
</script>

<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
	<div class="mb-4 flex gap-2" role="tablist" aria-label="Performance metric type">
		<button
			class={`rounded-md px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'page-load' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
			role="tab"
			aria-selected={activeTab === 'page-load'}
			tabindex={activeTab === 'page-load' ? 0 : -1}
			onclick={() => selectTab('page-load')}
		>
			Page Load
		</button>
		<button
			class={`rounded-md px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'spa-navigation' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
			role="tab"
			aria-selected={activeTab === 'spa-navigation'}
			tabindex={activeTab === 'spa-navigation' ? 0 : -1}
			onclick={() => selectTab('spa-navigation')}
		>
			SPA Navigation
		</button>
	</div>

	{#if activeTab === 'page-load'}
		<div class="mb-2 flex items-center justify-between">
			<h3 class="flex items-center gap-2 text-lg font-semibold">
				Recent Page Loads
				<span title="Time from navigation start to load event end (ms)">
					<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				</span>
			</h3>
			<button
				class="text-xs text-blue-600 hover:underline"
				onclick={() => {
					store.clearPageLoadMetrics();
					pageLoadMetrics = [];
				}}>Clear metrics</button
			>
		</div>
		{#if pageLoadMetrics.length === 0}
			<p class="text-gray-500">
				No page load metrics recorded yet. Try reloading the page or navigating to another route.
			</p>
		{:else}
			{#if pageLoadSummary()}
				<div class="mb-2 flex gap-4 text-xs text-gray-600">
					<span>Avg: {pageLoadSummary().avg.toFixed(1)}ms</span>
					<span>Min: {pageLoadSummary().min.toFixed(1)}ms</span>
					<span>Max: {pageLoadSummary().max.toFixed(1)}ms</span>
				</div>
			{/if}
			<ul class="space-y-4">
				{#each pageLoadMetrics as metric, i}
					<li class="rounded border bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<span class="font-mono text-xs text-gray-600"
								>{new Date(metric.timestamp).toLocaleString()}</span
							>
							<span class="text-xs text-gray-400">{metric.url}</span>
						</div>
						<PerformanceTracker {metric} />
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<div class="mb-2 flex items-center justify-between">
			<h3 class="flex items-center gap-2 text-lg font-semibold">
				Recent SPA Navigations
				<span title="Time for client-side navigation (ms)">
					<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				</span>
			</h3>
			<button
				class="text-xs text-blue-600 hover:underline"
				onclick={() => {
					store.clearSpaNavigationMetrics();
					spaNavigationMetrics = [];
				}}>Clear metrics</button
			>
		</div>
		{#if spaNavigationMetrics.length === 0}
			<p class="text-gray-500">
				No SPA navigation metrics recorded yet. Try navigating between pages using client-side
				links.
			</p>
		{:else}
			{#if spaNavSummary()}
				<div class="mb-2 flex gap-4 text-xs text-gray-600">
					<span>Avg: {spaNavSummary().avg.toFixed(1)}ms</span>
					<span>Min: {spaNavSummary().min.toFixed(1)}ms</span>
					<span>Max: {spaNavSummary().max.toFixed(1)}ms</span>
				</div>
			{/if}
			<ul class="space-y-4">
				{#each spaNavigationMetrics as metric, i}
					<li class="rounded border bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<span class="font-mono text-xs text-gray-600"
								>{new Date(metric.timestamp).toLocaleString()}</span
							>
							<span class="text-xs text-gray-400">{metric.url}</span>
						</div>
						<PerformanceTracker {metric} />
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>
