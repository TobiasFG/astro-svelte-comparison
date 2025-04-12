<script lang="ts">
	// Using Svelte 5 runes mode
	import { onMount, onDestroy } from "svelte";

	// State variables using Svelte 5 runes syntax
	let timerValue = $state(0); // Current timer value in seconds
	let initialTime = $state(60); // Default starting time (1 minute)
	let isRunning = $state(false); // Is the timer currently running?
	let intervalId = $state<number | null>(null); // To store the interval ID for cleanup

	// Format time as mm:ss
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const secs = (seconds % 60).toString().padStart(2, "0");
		return `${mins}:${secs}`;
	};

	// Input handler for setting the timer minutes
	function handleMinutesChange(e: Event): void {
		const minutes = parseInt((e.target as HTMLInputElement).value) || 0;
		initialTime = minutes * 60;

		// If timer is not running, update the current timer value
		if (!isRunning) {
			timerValue = initialTime;
		}
	}

	// Start the timer
	function startTimer(): void {
		if (isRunning) return;

		// If timer value is 0, reset it to initial time
		if (timerValue === 0) {
			timerValue = initialTime;
		}

		isRunning = true;
		intervalId = setInterval(() => {
			if (timerValue <= 0) {
				if (intervalId) clearInterval(intervalId);
				isRunning = false;
				return;
			}
			timerValue--;
		}, 1000);
	}

	// Pause the timer
	function pauseTimer(): void {
		if (!isRunning) return;

		if (intervalId) clearInterval(intervalId);
		isRunning = false;
	}

	// Reset the timer to initial value
	function resetTimer(): void {
		pauseTimer();
		timerValue = initialTime;
	}

	// Clear the timer (set to zero)
	function clearTimer(): void {
		pauseTimer();
		timerValue = 0;
	}

	// Initialize timer value on mount
	onMount(() => {
		timerValue = initialTime;
	});

	// Cleanup on destroy
	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="flex flex-col items-center p-6">
	<h2 class="text-2xl font-bold mb-6 text-gray-800">Timer App</h2>

	<div
		class="text-6xl font-mono font-bold mb-8 text-center w-full"
		aria-live="polite"
		role="timer"
	>
		{formatTime(timerValue)}
	</div>

	<div class="mb-6 w-full">
		<label
			for="timerMinutes"
			class="block text-sm font-medium text-gray-700 mb-1"
		>
			Set Minutes:
		</label>
		<input
			type="number"
			id="timerMinutes"
			min="0"
			step="1"
			value={Math.floor(initialTime / 60)}
			onchange={handleMinutesChange}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			aria-label="Set timer minutes"
			disabled={isRunning}
		/>
	</div>

	<div class="grid grid-cols-2 gap-4 w-full">
		{#if !isRunning}
			<button
				onclick={startTimer}
				class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
				aria-label="Start timer"
			>
				Start
			</button>
		{:else}
			<button
				onclick={pauseTimer}
				class="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors"
				aria-label="Pause timer"
			>
				Pause
			</button>
		{/if}

		<button
			onclick={resetTimer}
			class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
			aria-label="Reset timer"
		>
			Reset
		</button>

		<button
			onclick={clearTimer}
			class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors col-span-2"
			aria-label="Clear timer"
		>
			Clear
		</button>
	</div>
</div>
