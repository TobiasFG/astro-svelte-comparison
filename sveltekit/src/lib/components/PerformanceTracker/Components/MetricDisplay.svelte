<script lang="ts">
	let { text, value, unit, duration } = $props<{
		text: string;
		value: number | null;
		unit?: string;
		duration?: number | null;
	}>();
</script>

<div class="flex items-center justify-between gap-4">
	<span class="text-sm text-gray-600">{text}</span>
	{#if value !== null}
		<span class="text-right font-mono text-gray-800">
			{value?.toFixed(1)}{#if unit}{unit}{/if}
			{#if duration !== null && duration !== undefined}
				<span class="text-gray-500"
					>({duration.toFixed(1)}{#if unit}{unit}{/if})</span
				>
			{/if}
		</span>
	{:else}
		<span class="inline-block h-4 w-16 animate-pulse rounded bg-gray-200"></span>
	{/if}
</div>
