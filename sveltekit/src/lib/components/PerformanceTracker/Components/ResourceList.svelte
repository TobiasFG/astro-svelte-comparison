<script lang="ts">
	let { resources = [] } = $props();
</script>

<div class="flex flex-col gap-2">
	<div class="mt-2">
		<h4 class="mb-2 text-sm font-medium text-gray-700">Recent Resources</h4>
		<div class="max-h-40 space-y-1 overflow-y-auto">
			{#each resources as resource}
				<div class="bg-white/50 font-mono text-xs">
					<div class="flex items-center justify-between">
						<span class="truncate">
							{resource.name.split('/').slice(-1)[0].replace(/\?.*$/, '')}
						</span>
						<div class="flex items-center gap-2 text-[10px]">
							<span
								class={`rounded px-1.5 py-0.5 ${resource.deliveryType === 'cache' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
							>
								{resource.deliveryType === 'cache' ? 'cached' : 'network'}
							</span>
							<span
								class={`rounded px-1.5 py-0.5 ${resource.renderBlockingStatus === 'blocking' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
							>
								{resource.renderBlockingStatus === 'blocking' ? 'blocking' : 'non-blocking'}
							</span>
							<span class="ml-2">{resource.duration.toFixed(1)}ms</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
