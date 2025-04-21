<script lang="ts">
	import { getClientPagePerformanceTracker } from '$lib/controllers/ClientPerformanceTracker.svelte';
	import { fade, scale } from 'svelte/transition';
	import MetricDisplay from './Components/MetricDisplay.svelte';
	import ResourceList from './Components/ResourceList.svelte';
	import Timeline from './Components/Timeline.svelte';

	const tracker = getClientPagePerformanceTracker();

	let timelineMetrics = $derived(
		tracker
			? [
					{
						name: 'Request Sent',
						startTime: tracker.requestSentMark || 0,
						color: '#3B82F6'
					},
					{
						name: 'Response Delay',
						startTime: tracker.requestSentMark || 0,
						duration: tracker.responseDelayDuration,
						color: '#EF4444'
					},
					{
						name: 'Response Download',
						startTime: tracker.responseReceivedMark || 0,
						duration: tracker.responseDownloadDuration,
						color: '#10B981'
					},
					{
						name: 'First Paint',
						startTime: tracker.firstPaintMark || 0,
						duration: tracker.firstPaintDuration,
						color: '#8B5CF6'
					},
					{
						name: 'First Contentful Paint',
						startTime: tracker.firstContentfulPaintMark || 0,
						duration: tracker.firstContentfulPaintDuration,
						color: '#F59E0B'
					},
					{
						name: 'Largest Contentful Paint',
						startTime: tracker.largestContentfulPaintMark || 0,
						duration: tracker.largestContentfulPaintDuration,
						color: '#6366F1'
					}
				].filter((metric) => metric.startTime > 0)
			: []
	);

	let maxTime = $derived(
		tracker
			? Math.max(
					...[
						...timelineMetrics.map((m) => m.startTime + (m.duration || 0)),
						tracker.largestContentfulPaintMark || 0
					]
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

		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-lg bg-gray-50 p-4 shadow-sm">
				<h3 class="mb-4 text-lg font-medium text-gray-800">Navigation Metrics</h3>
				<div class="space-y-2">
					<MetricDisplay
						text={'Request sent after'}
						value={tracker.requestSentMark}
						unit="ms"
						duration={null}
					/>
					<MetricDisplay
						text={'Response received after'}
						value={tracker.responseReceivedMark}
						unit="ms"
						duration={tracker.responseDelayDuration}
					/>
					<MetricDisplay
						text={'Response complete after'}
						value={tracker.responseCompleteMark}
						unit="ms"
						duration={tracker.responseDownloadDuration}
					/>
					<MetricDisplay
						text={'Page load after'}
						value={tracker.firstPaintMark}
						unit="ms"
						duration={tracker.firstPaintDuration}
					/>
					<MetricDisplay
						text={'Page interactive after'}
						value={tracker.firstContentfulPaintMark}
						unit="ms"
						duration={tracker.firstContentfulPaintDuration}
					/>
					<MetricDisplay
						text={'Largest contentful paint after'}
						value={tracker.largestContentfulPaintMark}
						unit="ms"
						duration={tracker.largestContentfulPaintDuration}
					/>
					<MetricDisplay
						text={'Dom interactive after'}
						value={tracker.domInteractiveMark}
						unit="ms"
						duration={null}
					/>
					<MetricDisplay
						text={'Dom complete after'}
						value={tracker.domCompleteMark}
						unit="ms"
						duration={null}
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
