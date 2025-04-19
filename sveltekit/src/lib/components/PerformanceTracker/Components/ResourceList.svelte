<script lang="ts">
	interface Props {
		resources?: PerformanceResourceTiming[];
		allFromCache: boolean;
		hasBlockingResources: boolean;
	}

	let { resources = [], allFromCache, hasBlockingResources }: Props = $props();
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium">Cache</span>
			<div class={`h-3 w-3 rounded-full ${allFromCache ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium">Blocking</span>
			<div
				class={`h-3 w-3 rounded-full ${!hasBlockingResources ? 'bg-green-500' : 'bg-red-500'}`}
			></div>
		</div>
	</div>

	<div class="mt-2">
		<h4 class="mb-2 text-sm font-medium text-gray-700">Recent Resources</h4>
		<div class="max-h-40 space-y-1 overflow-y-auto">
			{#each resources as resource}
				<div class="rounded bg-white/50 p-1 font-mono text-xs">
					<div class="flex justify-between">
						<span class="truncate">{resource.name}</span>
						<span>{resource.duration.toFixed(1)}ms</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
