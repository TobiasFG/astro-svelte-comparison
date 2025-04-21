<!-- filepath: /Users/tfg/Documents/astro-svelte-comparison/sveltekit/src/lib/components/PerformanceTracker/Components/Timeline.svelte -->
<script lang="ts">
	interface TimelineMetric {
		name: string;
		startTime: number;
		duration?: number | null;
		color?: string;
	}

	let { metrics, maxTime } = $props();

	// Calculate styles and positions
	let metricStyles = $derived(
		metrics.map((metric: TimelineMetric) => ({
			left: `${(metric.startTime / maxTime) * 100}%`,
			width: metric.duration ? `${(metric.duration / maxTime) * 100}%` : '4px',
			backgroundColor: metric.color || '#3B82F6'
		}))
	);

	// Create time scale markers
	let timeMarkers = $derived(
		[0, 0.25, 0.5, 0.75, 1].map((percent) => ({
			position: `${percent * 100}%`,
			value: (maxTime * percent).toFixed(1)
		}))
	);
</script>

<div class="mb-6 rounded-lg bg-gray-50 p-6 shadow-sm">
	<h3 class="mb-6 text-lg font-medium text-gray-800">Performance Timeline</h3>

	<div class="relative">
		<!-- Time scale -->
		<div class="mb-8 flex justify-between text-xs text-gray-400">
			{#each timeMarkers as marker}
				<div class="absolute font-mono" style="left: {marker.position}">
					{marker.value}ms
				</div>
			{/each}
		</div>

		<!-- Main timeline -->
		<div class="relative mt-6">
			<!-- Background grid -->
			<div class="absolute inset-0">
				{#each timeMarkers as marker}
					<div
						class="absolute bottom-0 top-0 w-px bg-gray-100"
						style="left: {marker.position}"
					></div>
				{/each}
			</div>

			<!-- Metrics -->
			<div class="space-y-6">
				{#each metrics as metric, i}
					<div class="relative flex items-center gap-4">
						<!-- Label -->
						<div class="w-48 text-right">
							<div class="text-sm font-medium text-gray-700">
								{metric.name}
							</div>
							<div class="text-xs text-gray-500">
								{metric.startTime.toFixed(1)}ms
								{#if metric.duration}
									<span class="text-gray-400">
										(+{metric.duration.toFixed(1)}ms)
									</span>
								{/if}
							</div>
						</div>

						<!-- Timeline bar -->
						<div class="relative flex-1">
							<div class="absolute h-px w-full bg-gray-200"></div>
							<div
								class="absolute h-3 rounded transition-all duration-300"
								style:left={metricStyles[i].left}
								style:width={metricStyles[i].width}
								style:background-color={metricStyles[i].backgroundColor}
							>
								{#if metric.duration}
									<div
										class="absolute -top-5 left-0 whitespace-nowrap text-[10px] font-medium"
										style:color={metric.color}
									>
										{metric.duration.toFixed(1)}ms
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
