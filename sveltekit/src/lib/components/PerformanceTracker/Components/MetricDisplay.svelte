<script lang="ts">
	interface Props {
		text: string;
		value: number | null;
		unit?: string;
	}
	let { text, value, unit }: Props = $props();
</script>

<p>
	{text}:
	{#if value !== null}
		<span class="font-mono text-sm">
			{value?.toFixed(1)}{#if unit}{unit}{/if}
		</span>
	{:else}
		<span class="inline-block h-4 w-16 animate-pulse rounded bg-gray-200 font-mono text-sm"></span>
	{/if}
</p>
