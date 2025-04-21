<!-- filepath: /Users/tfg/Documents/astro-svelte-comparison/sveltekit/src/lib/components/PerformanceTracker/Components/Timeline.svelte -->
<script lang="ts">
	let { metrics, maxTime } = $props();

	// Define the type for metrics
	type Metric = {
		name: string;
		startTime: number;
		duration?: number;
		color?: string;
	};

	// Calculate relative position and width for each metric
	let metricStyles = $derived(
		metrics.map((metric: Metric) => ({
			left: `${(metric.startTime / maxTime) * 100}%`,
			width: metric.duration ? `${(metric.duration / maxTime) * 100}%` : '2px',
			backgroundColor: metric.color || '#3B82F6'
		}))
	);
</script>

<div class="mb-6 rounded-lg bg-gray-50 p-4 shadow-sm">
	<h3 class="mb-4 text-lg font-medium text-gray-800">Performance Timeline</h3>
	<div class="relative h-[200px] w-full">
		<!-- Timeline base -->
		<div class="absolute bottom-8 left-0 h-1 w-full bg-gray-200"></div>

		<!-- Metrics -->
		{#each metrics as metric, i}
			<div
				class="absolute bottom-7 h-3 min-w-[2px] rounded-sm transition-all duration-300"
				style:left={metricStyles[i].left}
				style:width={metricStyles[i].width}
				style:background-color={metricStyles[i].backgroundColor}
			>
				<div class="absolute left-0 top-4 transform">
					<div class="flex items-center gap-1">
						<span class="whitespace-nowrap text-xs font-medium text-gray-600">
							{metric.name}
						</span>
						<span class="text-xs text-gray-500">
							({metric.startTime.toFixed(1)}ms
							{#if metric.duration}
								- {metric.duration.toFixed(1)}ms
							{/if})
						</span>
					</div>
				</div>
			</div>
		{/each}

		<!-- Time markers -->
		<div class="absolute bottom-0 flex w-full justify-between text-xs text-gray-500">
			<span>0ms</span>
			<span>{(maxTime / 4).toFixed(1)}ms</span>
			<span>{(maxTime / 2).toFixed(1)}ms</span>
			<span>{((maxTime * 3) / 4).toFixed(1)}ms</span>
			<span>{maxTime.toFixed(1)}ms</span>
		</div>
	</div>
</div>
