<script lang="ts">
	import { getClientPagePerformanceTracker } from '$lib/controllers/ClientPerformanceTracker.svelte';
	import { fade, scale } from 'svelte/transition';
	import MetricDisplay from './Components/MetricDisplay.svelte';

	const clientPagePerformanceTracker = getClientPagePerformanceTracker();
</script>

{#if clientPagePerformanceTracker}
	<button
		class={[
			'scale-3d fixed bottom-2 left-2 rounded-md bg-indigo-300 p-1.5 shadow transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-md'
		]}
		onclick={() => {
			clientPagePerformanceTracker.TogglePerformanceTracker();
		}}
		transition:fade
		aria-label="Toggle Performance Tracker Window"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M8 20.846V16H3.154V8H8V3.154h8V8h4.846v8H16v4.846zM4.154 11.5H9q.135 0 .235.058t.167.161l1.452 2.166l1.677-5.031q.061-.165.18-.26t.285-.094q.129 0 .245.061q.116.06.18.158l1.835 2.781h4.59V9H15V4.154H9V9H4.154zM9 19.846h6V15h4.846v-2.5H15q-.125 0-.238-.066t-.189-.172l-1.427-2.147l-1.677 5.031q-.061.165-.192.26t-.304.094q-.133 0-.233-.058t-.167-.161L8.719 12.5H4.154V15H9zM12 12"
			/>
		</svg>
	</button>

	{#if clientPagePerformanceTracker.isOpen}
		<div
			in:scale={{
				start: 0.95,
				opacity: 1,
				duration: 150
			}}
			out:scale={{
				start: 0.95,
				opacity: 0,
				duration: 150
			}}
			class={[
				'fixed bottom-2 left-2 mb-10 rounded-md border border-indigo-300 bg-indigo-50 p-1.5',
				'flex flex-col gap-2'
			]}
		>
			<div class="mb-3 flex items-center gap-2">
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
				<h3 class="font-medium text-gray-800">Performance Metrics</h3>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<h3 class="mb-2 font-semibold">Navigation metrics</h3>
					<MetricDisplay
						text={'Request sent	after'}
						value={clientPagePerformanceTracker.RequestSentMark}
						unit="ms"
					/>
					<MetricDisplay
						text={'Response received after'}
						value={clientPagePerformanceTracker.ResponseReceivedMark}
						unit="ms"
					/>
					<MetricDisplay
						text={'Response Download took'}
						value={clientPagePerformanceTracker.ResponseDownloadDuration}
						unit="ms"
					/>
					<MetricDisplay
						text={'Response complete after'}
						value={clientPagePerformanceTracker.ResponseCompleteMark}
						unit="ms"
					/>
					<MetricDisplay
						text={'Dom interactive after'}
						value={clientPagePerformanceTracker.DomInteractiveMark}
						unit="ms"
					/>
					<MetricDisplay
						text={'Dom complete after'}
						value={clientPagePerformanceTracker.DomCompleteMark}
						unit="ms"
					/>
				</div>
				<div>
					<h3 class="mb-2 font-semibold">Resource metrics</h3>
					<MetricDisplay
						text={'Total resources loaded'}
						value={clientPagePerformanceTracker.TotalResourceCount}
					/>
					<MetricDisplay
						text={'Resources from cache'}
						value={clientPagePerformanceTracker.TotalResourceFromCacheCount}
					/>
					<MetricDisplay
						text={'Total download time'}
						value={clientPagePerformanceTracker.TotalResourceDownloadTimeSpent}
						unit="ms"
					/>
				</div>
			</div>
		</div>
	{/if}
{/if}
