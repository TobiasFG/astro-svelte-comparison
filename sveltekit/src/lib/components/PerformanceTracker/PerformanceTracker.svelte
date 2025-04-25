<script lang="ts">
	import type { PageLoadMetric, SpaNavigationMetric } from '$lib/stores/performance-store.svelte';
	import MetricDisplay from './Components/MetricDisplay.svelte';
	import Timeline from './Components/Timeline.svelte';

	const { metric } = $props<{ metric: PageLoadMetric | SpaNavigationMetric }>();

	function getTimelineMetrics(metric: PageLoadMetric | SpaNavigationMetric) {
		if (metric.type === 'page-load') {
			const nav = metric.metrics;
			return [
				{
					name: 'Redirect',
					startTime: nav.redirectStart - nav.startTime,
					duration: nav.redirectEnd - nav.redirectStart,
					color: '#6366F1'
				},
				{
					name: 'DNS',
					startTime: nav.domainLookupStart - nav.startTime,
					duration: nav.domainLookupEnd - nav.domainLookupStart,
					color: '#F59E42'
				},
				{
					name: 'TCP',
					startTime: nav.connectStart - nav.startTime,
					duration: nav.connectEnd - nav.connectStart,
					color: '#F59E0B'
				},
				{
					name: 'Request',
					startTime: nav.requestStart - nav.startTime,
					duration: nav.responseStart - nav.requestStart,
					color: '#EF4444'
				},
				{
					name: 'Response',
					startTime: nav.responseStart - nav.startTime,
					duration: nav.responseEnd - nav.responseStart,
					color: '#10B981'
				},
				{
					name: 'DOM Content Loaded',
					startTime: nav.domContentLoadedEventStart - nav.startTime,
					duration: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
					color: '#F472B6'
				},
				{
					name: 'Load Event',
					startTime: nav.loadEventStart - nav.startTime,
					duration: nav.loadEventEnd - nav.loadEventStart,
					color: '#FBBF24'
				},
				{
					name: 'First Paint',
					startTime: metric.paints['first-paint'] ?? 0,
					duration: 0.5,
					color: '#F59E0B'
				},
				{
					name: 'First Contentful Paint',
					startTime: metric.paints['first-contentful-paint'] ?? 0,
					duration: 0.5,
					color: '#D97706'
				}
			];
		} else {
			return [
				{
					name: 'SPA Navigation',
					startTime: metric.start,
					duration: metric.duration,
					color: '#3B82F6'
				}
			];
		}
	}

	const timelineMetrics = $derived(() => getTimelineMetrics(metric));
	const maxTime = $derived(() =>
		timelineMetrics.length > 0
			? Math.max(...timelineMetrics.map((m) => m.startTime + (m.duration || 0))) * 1.1
			: 0
	);
</script>

<div class="mt-4">
	{#if timelineMetrics.length > 0}
		<Timeline metrics={timelineMetrics} {maxTime} />
	{:else}
		<p class="mb-4 text-sm text-gray-500">No timeline data available for this metric.</p>
	{/if}

	{#if metric.type === 'page-load'}
		<section aria-labelledby="nav-metrics" class="mt-4">
			<h4 id="nav-metrics" class="mb-2 text-base font-semibold">Navigation Metrics</h4>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<MetricDisplay
					text="Redirect"
					value={metric.metrics.redirectStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.redirectEnd - metric.metrics.redirectStart}
				/>
				<MetricDisplay
					text="DNS"
					value={metric.metrics.domainLookupStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.domainLookupEnd - metric.metrics.domainLookupStart}
				/>
				<MetricDisplay
					text="TCP"
					value={metric.metrics.connectStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.connectEnd - metric.metrics.connectStart}
				/>
				<MetricDisplay
					text="Request"
					value={metric.metrics.requestStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.responseStart - metric.metrics.requestStart}
				/>
				<MetricDisplay
					text="Response"
					value={metric.metrics.responseStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.responseEnd - metric.metrics.responseStart}
				/>
				<MetricDisplay
					text="DOM Content Loaded"
					value={metric.metrics.domContentLoadedEventStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.domContentLoadedEventEnd -
						metric.metrics.domContentLoadedEventStart}
				/>
				<MetricDisplay
					text="Load Event"
					value={metric.metrics.loadEventStart - metric.metrics.startTime}
					unit="ms"
					duration={metric.metrics.loadEventEnd - metric.metrics.loadEventStart}
				/>
			</div>
		</section>
		<section aria-labelledby="paint-metrics" class="mt-6">
			<h4 id="paint-metrics" class="mb-2 text-base font-semibold">Paint Metrics</h4>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<MetricDisplay
					text="First Paint"
					value={typeof metric.paints['first-paint'] === 'number'
						? metric.paints['first-paint']
						: null}
					unit="ms"
					duration={null}
				/>
				<MetricDisplay
					text="First Contentful Paint"
					value={typeof metric.paints['first-contentful-paint'] === 'number'
						? metric.paints['first-contentful-paint']
						: null}
					unit="ms"
					duration={null}
				/>
			</div>
		</section>
	{:else}
		<section aria-labelledby="spa-metrics" class="mt-4">
			<h4 id="spa-metrics" class="mb-2 text-base font-semibold">SPA Navigation</h4>
			<div class="grid gap-4 md:grid-cols-2">
				<MetricDisplay
					text="SPA Navigation Duration"
					value={metric.duration}
					unit="ms"
					duration={null}
				/>
				<MetricDisplay text="Start Time" value={metric.start} unit="ms" duration={null} />
				<MetricDisplay text="End Time" value={metric.end} unit="ms" duration={null} />
			</div>
		</section>
	{/if}
</div>
