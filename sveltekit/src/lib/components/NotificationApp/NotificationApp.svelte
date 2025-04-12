<script lang="ts">
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

{#snippet notificationButton(
    onClick: () => void,
    borderColor: string,
    textColor: string,
    hoverBgColor: string,
    label: string,
)}
    <button
        on:click={onClick}
        class="px-4 py-2 bg-white border-2 {borderColor} {textColor} rounded-md hover:{hoverBgColor} hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50 {borderColor.replace(
            'border',
            'focus:ring',
        )}"
        aria-label={label}
    >
        {label}
    </button>
{/snippet}

<div class="flex flex-col justify-center">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Notification Demo</h2>
    <p class="text-gray-600 mb-6">
        Click the buttons below to trigger different types of notifications
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {@render notificationButton(
            showErrorNotification,
            "border-red-500",
            "text-red-600",
            "bg-red-500",
            "Error Notification",
        )}

        {@render notificationButton(
            showSuccessNotification,
            "border-green-500",
            "text-green-600",
            "bg-green-500",
            "Success Notification",
        )}

        {@render notificationButton(
            showWarningNotification,
            "border-amber-500",
            "text-amber-600",
            "bg-amber-500",
            "Warning Notification",
        )}

        {@render notificationButton(
            showInfoNotification,
            "border-blue-500",
            "text-blue-600",
            "bg-blue-500",
            "Info Notification",
        )}

        {@render notificationButton(
            showPersistentNotification,
            "border-purple-500",
            "text-purple-600",
            "bg-purple-500",
            "Persistent Notification",
        )}
    </div>
</div>
