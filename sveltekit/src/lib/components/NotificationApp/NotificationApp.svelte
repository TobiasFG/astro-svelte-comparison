<script>
    import { getNotificationStore } from "$lib/stores/notification-store.svelte";

    const notificationStore = getNotificationStore();

    function showErrorNotification() {
        notificationStore.error(
            "Something went wrong with the operation.",
            "Error",
        );
    }

    function showSuccessNotification() {
        notificationStore.success(
            "The operation completed successfully!",
            "Success",
        );
    }

    function showWarningNotification() {
        notificationStore.warning(
            "This action might have unintended consequences.",
            "Warning",
        );
    }

    function showInfoNotification() {
        notificationStore.info(
            "Here's some useful information you should know.",
            "Information",
        );
    }

    // Persistent notification that doesn't auto-close
    function showPersistentNotification() {
        notificationStore.add({
            type: "info",
            message: "This notification will stay until manually dismissed.",
            title: "Persistent Notification",
            autoClose: false,
        });
    }
</script>

<div class="flex flex-col justify-center">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Notification Demo</h2>
    <p class="text-gray-600 mb-6">
        Click the buttons below to trigger different types of notifications
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
            on:click={showErrorNotification}
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            Error Notification
        </button>

        <button
            on:click={showSuccessNotification}
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            Success Notification
        </button>

        <button
            on:click={showWarningNotification}
            class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Warning Notification
        </button>

        <button
            on:click={showInfoNotification}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Info Notification
        </button>

        <button
            on:click={showPersistentNotification}
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
            Persistent Notification
        </button>
    </div>

    <div class="mt-6 border-t border-gray-200 pt-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">How It Works</h3>
        <ul class="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Notifications appear in the bottom right corner</li>
            <li>Standard notifications disappear after 4 seconds</li>
            <li>Persistent notifications stay until manually dismissed</li>
            <li>Click the "Show History" button to view past notifications</li>
            <li>All notifications are stored in the browser's local storage</li>
        </ul>
    </div>
</div>
