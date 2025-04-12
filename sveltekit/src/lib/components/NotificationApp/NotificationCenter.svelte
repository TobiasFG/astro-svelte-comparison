<script>
    import NotificationItem from './NotificationItem.svelte';
    import { getNotificationStore } from '$lib/stores/notification-store.svelte';

    const notificationStore = getNotificationStore();
    
    // Access derived values
    const activeNotifications = $derived(notificationStore.activeNotifications);
    const historyNotifications = $derived(notificationStore.historyNotifications);
    const showHistory = $derived(notificationStore.showHistory);
    
    function toggleHistory() {
        notificationStore.toggleHistory();
    }
    
    function clearHistory() {
        notificationStore.clearHistory();
    }
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2" aria-live="polite">
    <!-- Active notifications -->
    <div class="flex flex-col-reverse">
        {#each activeNotifications as notification (notification.id)}
            <NotificationItem {notification} />
        {/each}
    </div>
    
    <!-- History toggle button -->
    <div class="flex items-center space-x-2">
        {#if historyNotifications.length > 0}
            <button 
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onclick={toggleHistory}
                aria-expanded={showHistory}
                aria-controls="notification-history"
            >
                {#if showHistory}
                    Hide History ({historyNotifications.length})
                {:else}
                    Show History ({historyNotifications.length})
                {/if}
            </button>
            
            {#if showHistory}
                <button 
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onclick={clearHistory}
                    aria-label="Clear notification history"
                >
                    Clear
                </button>
            {/if}
        {/if}
    </div>
    
    <!-- History panel -->
    {#if showHistory && historyNotifications.length > 0}
        <div 
            id="notification-history"
            class="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2 max-h-96 overflow-y-auto"
            tabindex="-1"
        >
            <h2 class="text-lg font-medium text-gray-900 mb-4">Notification History</h2>
            <div class="space-y-3">
                {#each historyNotifications as notification (notification.id)}
                    <NotificationItem {notification} />
                {/each}
            </div>
        </div>
    {/if}
</div>
