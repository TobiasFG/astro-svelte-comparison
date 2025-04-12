import { getContext, onDestroy, setContext } from 'svelte';
import { browser } from '$app/environment';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    title?: string;
    timestamp: number;
    dismissed: boolean;
    autoClose?: boolean;
}

const STORAGE_KEY = 'svelte-notifications';
const AUTO_CLOSE_DURATION = 4000; // 4 seconds

export class NotificationStore {
    notifications = $state<Notification[]>([]);
    isLoading = $state(true);
    showHistory = $state(false);

    constructor() {
        // Load notifications from localStorage on initialization (only in browser)
        if (browser) {
            setTimeout(() => {
                const storedNotifications = localStorage.getItem(STORAGE_KEY);
                if (storedNotifications) {
                    this.notifications = JSON.parse(storedNotifications);
                }
                this.isLoading = false;
            }, 100);
        } else {
            this.isLoading = false;
        }

        // Save notifications to localStorage whenever they change
        $effect(() => {
            if (browser && this.notifications && !this.isLoading) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
            }
        });

        onDestroy(() => {
            // Cleanup if needed
        });
    }

    add(options: {
        type: NotificationType;
        message: string;
        title?: string;
        autoClose?: boolean;
    }) {
        const { type, message, title, autoClose = true } = options;

        const id = crypto.randomUUID();
        const notification: Notification = {
            id,
            type,
            message,
            title,
            timestamp: Date.now(),
            dismissed: false,
            autoClose
        };

        this.notifications = [...this.notifications, notification];

        // Auto-dismiss after timeout if autoClose is enabled
        if (browser && autoClose) {
            setTimeout(() => {
                this.dismiss(id);
            }, AUTO_CLOSE_DURATION);
        }

        return id;
    }

    dismiss(id: string) {
        this.notifications = this.notifications.map(notification =>
            notification.id === id
                ? { ...notification, dismissed: true }
                : notification
        );
    }

    remove(id: string) {
        this.notifications = this.notifications.filter(notification =>
            notification.id !== id
        );
    }

    clearAll() {
        this.notifications = this.notifications.map(notification => ({
            ...notification,
            dismissed: true
        }));
    }

    clearHistory() {
        this.notifications = this.notifications.filter(notification =>
            !notification.dismissed
        );
    }

    toggleHistory() {
        this.showHistory = !this.showHistory;
    }

    // Helper methods to create different types of notifications
    error(message: string, title?: string) {
        return this.add({ type: 'error', message, title });
    }

    success(message: string, title?: string) {
        return this.add({ type: 'success', message, title });
    }

    warning(message: string, title?: string) {
        return this.add({ type: 'warning', message, title });
    }

    info(message: string, title?: string) {
        return this.add({ type: 'info', message, title });
    }

    // Get active notifications (not dismissed)
    get activeNotifications() {
        return this.notifications.filter(notification => !notification.dismissed);
    }

    // Get history notifications (dismissed)
    get historyNotifications() {
        return this.notifications
            .filter(notification => notification.dismissed)
            .sort((a, b) => b.timestamp - a.timestamp);
    }
}

const NOTIFICATION_STORE_KEY = Symbol('NOTIFICATION_STORE');

export function initNotificationStore() {
    return setContext(NOTIFICATION_STORE_KEY, new NotificationStore());
}

export function getNotificationStore() {
    return getContext<ReturnType<typeof initNotificationStore>>(NOTIFICATION_STORE_KEY);
}
