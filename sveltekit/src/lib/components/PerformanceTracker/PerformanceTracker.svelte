<script lang="ts">
	import { getPerformanceTracker } from '$lib/controllers/PerformanceTracker.svelte';
	import { fade, scale } from 'svelte/transition';
	import MetricDisplay from './Components/MetricDisplay.svelte';
	import ResourceList from './Components/ResourceList.svelte';
	import Timeline from './Components/Timeline.svelte';

	const tracker = getPerformanceTracker();

	let timelineMetrics = $derived(
		tracker
			? [
					// Network Phase
					{
						name: 'Redirect',
						startTime: tracker.redirect.start ?? 0,
						duration: tracker.redirect.duration,
						color: '#6366F1'
					},
					{
						name: 'Service Worker',
						startTime: tracker.worker.start ?? 0,
						duration: tracker.worker.duration,
						color: '#A21CAF'
					},
					{
						name: 'Fetch',
						startTime: tracker.fetch.start ?? 0,
						duration: tracker.fetch.duration,
						color: '#2563EB'
					},
					{
						name: 'DNS',
						startTime: tracker.dns.start ?? 0,
						duration: tracker.dns.duration,
						color: '#F59E42'
					},
					{
						name: 'TCP',
						startTime: tracker.tcp.start ?? 0,
						duration: tracker.tcp.duration,
						color: '#F59E0B'
					},
					{
						name: 'TLS',
						startTime: tracker.tls.start ?? 0,
						duration: tracker.tls.duration,
						color: '#10B981'
					},
					{
						name: 'Request',
						startTime: tracker.request.start ?? 0,
						duration: tracker.request.duration,
						color: '#EF4444'
					},
					{
						name: 'Response',
						startTime: tracker.response.start ?? 0,
						duration: tracker.response.duration,
						color: '#10B981'
					},
					{
						name: 'DOM Content Loaded',
						startTime: tracker.domContentLoaded.start ?? 0,
						duration: tracker.domContentLoaded.duration,
						color: '#F472B6'
					},
					{
						name: 'DOM Interactive',
						startTime: tracker.domInteractive.start ?? 0,
						duration: tracker.domInteractive.duration,
						color: '#6366F1'
					},
					{
						name: 'DOM Complete',
						startTime: tracker.domComplete.start ?? 0,
						duration: tracker.domComplete.duration,
						color: '#14B8A6'
					},
					{
						name: 'Unload Event',
						startTime: tracker.unloadEvent.start ?? 0,
						duration: tracker.unloadEvent.duration,
						color: '#F87171'
					},
					{
						name: 'Load Event',
						startTime: tracker.loadEvent.start ?? 0,
						duration: tracker.loadEvent.duration,
						color: '#FBBF24'
					},
					// Paint Phase
					{
						name: 'First Paint',
						startTime: tracker.firstPaint.start ?? 0,
						duration: tracker.firstPaint.duration,
						color: '#F59E0B'
					},
					{
						name: 'First Contentful Paint',
						startTime: tracker.firstContentfulPaint.start ?? 0,
						duration: tracker.firstContentfulPaint.duration,
						color: '#D97706'
					},
					{
						name: 'Largest Contentful Paint',
						startTime: tracker.largestContentfulPaint.start ?? 0,
						duration: tracker.largestContentfulPaint.duration,
						color: '#B45309'
					},
					// Svelte Hydration
					{
						name: 'Svelte Hydration',
						startTime: tracker.svelteHydration.start ?? 0,
						duration: tracker.svelteHydration.duration,
						color: '#6366F1'
					}
				].filter((metric) => metric.startTime > 0 && metric.duration != null)
			: []
	);

	let maxTime = $derived(
		tracker
			? Math.max(
					...timelineMetrics.map((m) => m.startTime + (m.duration || 0)),
					tracker.largestContentfulPaint.end ?? 0,
					tracker.domComplete.end ?? 0,
					tracker.loadEvent.end ?? 0
				) * 1.1
			: 0
	);
</script>

{#if tracker}
	<div
		in:scale={{ start: 0.95, opacity: 1, duration: 150 }}
		out:scale={{ start: 0.95, opacity: 0, duration: 150 }}
		class="mt-8 rounded-lg"
	>
		<div class="mb-6 flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-blue-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
			<h2 class="text-xl font-semibold text-gray-800">Performance Metrics</h2>
		</div>

		{#if timelineMetrics.length > 0}
			<Timeline metrics={timelineMetrics} {maxTime} />
		{/if}

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg bg-gray-50 p-4 shadow-sm">
				<h3 class="mb-4 text-lg font-medium text-gray-800">Navigation Metrics</h3>
				<div class="space-y-2">
					<MetricDisplay
						text={'Redirect'}
						value={tracker.redirect.start}
						unit="ms"
						duration={tracker.redirect.duration}
					/>
					<MetricDisplay
						text={'Service Worker'}
						value={tracker.worker.start}
						unit="ms"
						duration={tracker.worker.duration}
					/>
					<MetricDisplay
						text={'Fetch'}
						value={tracker.fetch.start}
						unit="ms"
						duration={tracker.fetch.duration}
					/>
					<MetricDisplay
						text={'DNS'}
						value={tracker.dns.start}
						unit="ms"
						duration={tracker.dns.duration}
					/>
					<MetricDisplay
						text={'TCP'}
						value={tracker.tcp.start}
						unit="ms"
						duration={tracker.tcp.duration}
					/>
					<MetricDisplay
						text={'TLS'}
						value={tracker.tls.start}
						unit="ms"
						duration={tracker.tls.duration}
					/>
					<MetricDisplay
						text={'Request'}
						value={tracker.request.start}
						unit="ms"
						duration={tracker.request.duration}
					/>
					<MetricDisplay
						text={'Response'}
						value={tracker.response.start}
						unit="ms"
						duration={tracker.response.duration}
					/>
					<MetricDisplay
						text={'DOM Content Loaded'}
						value={tracker.domContentLoaded.start}
						unit="ms"
						duration={tracker.domContentLoaded.duration}
					/>
					<MetricDisplay
						text={'DOM Interactive'}
						value={tracker.domInteractive.start}
						unit="ms"
						duration={tracker.domInteractive.duration}
					/>
					<MetricDisplay
						text={'DOM Complete'}
						value={tracker.domComplete.start}
						unit="ms"
						duration={tracker.domComplete.duration}
					/>
					<MetricDisplay
						text={'Unload Event'}
						value={tracker.unloadEvent.start}
						unit="ms"
						duration={tracker.unloadEvent.duration}
					/>
					<MetricDisplay
						text={'Load Event'}
						value={tracker.loadEvent.start}
						unit="ms"
						duration={tracker.loadEvent.duration}
					/>
				</div>
			</div>
			<div class="rounded-lg bg-gray-50 p-4 shadow-sm">
				<h3 class="mb-4 text-lg font-medium text-gray-800">Paint Metrics</h3>
				<div class="space-y-2">
					<MetricDisplay
						text={'First Paint'}
						value={tracker.firstPaint.start}
						unit="ms"
						duration={tracker.firstPaint.duration}
					/>
					<MetricDisplay
						text={'First Contentful Paint'}
						value={tracker.firstContentfulPaint.start}
						unit="ms"
						duration={tracker.firstContentfulPaint.duration}
					/>
					<MetricDisplay
						text={'Largest Contentful Paint'}
						value={tracker.largestContentfulPaint.start}
						unit="ms"
						duration={tracker.largestContentfulPaint.duration}
					/>
				</div>
			</div>
			<div class="rounded-lg bg-gray-50 p-4 shadow-sm">
				<h3 class="mb-4 text-lg font-medium text-gray-800">Resource Metrics</h3>
				<MetricDisplay
					text={'Resources'}
					value={tracker.totalResourceCount}
					unit=""
					duration={null}
				/>
				<MetricDisplay
					text={'Total time'}
					value={tracker.totalResourceDownloadTimeSpent}
					unit="ms"
					duration={null}
				/>
				<ResourceList resources={tracker.recentResources} />
			</div>
		</div>
	</div>
{/if}
