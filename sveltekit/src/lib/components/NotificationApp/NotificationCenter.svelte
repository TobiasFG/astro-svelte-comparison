<script>
    import NotificationItem from "./NotificationItem.svelte";
    import { getNotificationStore } from "$lib/stores/notification-store.svelte";
    import { fly, slide, scale, fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { quintOut, backIn, backOut } from "svelte/easing";

    const notificationStore = getNotificationStore();

    // Animation durations
    const notificationDuration = 300;
    const historyPanelDuration = 400;
</script>

<div
    class="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2"
    aria-live="polite"
>
    <!-- Active notifications -->
    <div class="flex flex-col-reverse">
        {#each notificationStore.activeNotifications as notification (notification.id)}
            <div
                in:fly={{
                    x: 50,
                    duration: notificationDuration,
                    easing: backOut,
                }}
                out:scale={{
                    start: 0.95,
                    opacity: 0,
                    duration: notificationDuration,
                }}
                animate:flip={{ duration: notificationDuration }}
                class="w-full"
            >
                <NotificationItem {notification} />
            </div>
        {/each}
    </div>

    <!-- History toggle button -->
    <div class="flex items-center space-x-2">
        {#if notificationStore.historyNotifications.length > 0}
            <button
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transform transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onclick={() => notificationStore.toggleHistory()}
                aria-expanded={notificationStore.showHistory}
                aria-controls="notification-history"
                transition:scale={{ duration: 200, easing: quintOut }}
            >
                {#if notificationStore.showHistory}
                    Hide History ({notificationStore.historyNotifications
                        .length})
                {:else}
                    Show History ({notificationStore.historyNotifications
                        .length})
                {/if}
            </button>

            {#if notificationStore.showHistory}
                <button
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:scale-105 transform transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onclick={notificationStore.clearHistory}
                    aria-label="Clear notification history"
                    in:fade={{ duration: 200 }}
                >
                    Clear
                </button>
            {/if}
        {/if}
    </div>

    <!-- History panel -->
    {#if notificationStore.showHistory && notificationStore.historyNotifications.length > 0}
        <div
            id="notification-history"
            class="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2 max-h-96 overflow-y-auto"
            tabindex="-1"
            in:slide={{ duration: historyPanelDuration, easing: quintOut }}
            out:slide={{ duration: historyPanelDuration / 1.5, easing: backIn }}
        >
            <h2
                class="text-lg font-medium text-gray-900 mb-4"
                in:fade={{ duration: historyPanelDuration, delay: 100 }}
            >
                Notification History
            </h2>
            <div class="space-y-3">
                {#each notificationStore.historyNotifications as notification, i (notification.id)}
                    <div
                        in:fade={{ duration: 300, delay: 50 * i }}
                        animate:flip={{ duration: 400 }}
                    >
                        <NotificationItem {notification} />
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
