<script lang="ts">
    let {
        color,
        renderedAt,
        text,
    }: { color: string; renderedAt: Date; text: string } = $props();

    let now = $state(new Date());

    // Update the current time every second using proper effect syntax
    $effect(() => {
        const interval = setInterval(() => {
            now = new Date();
        }, 1000);

        return () => {
            // This cleanup function runs when the component is destroyed
            clearInterval(interval);
        };
    });

    let timeElapsed = $derived.by(() => {
        const elapsed = now.getTime() - renderedAt.getTime();
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return `${seconds} seconds`;
        if (minutes < 60) return `${minutes} minutes`;
        if (hours < 24) return `${hours} hours`;
        return `${days} days`;
    });
</script>

<div
    class={[
        "p-5 rounded-md border shadow-sm mb-4",
        "border-" + color + "-100",
        "bg-" + color + "-50",
    ]}
>
    <div class="flex items-center">
        <svg
            class={["h-6 w-6 mr-3", "text-" + color + "-500"]}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
        <p>
            <span class="font-medium">{text}</span>
            {timeElapsed} ago.
        </p>
    </div>
</div>
