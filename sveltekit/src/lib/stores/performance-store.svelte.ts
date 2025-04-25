import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { beforeNavigate, afterNavigate } from '$app/navigation';
import { onMount } from 'svelte';

export type PageLoadMetric = {
    type: 'page-load';
    timestamp: number;
    url: string;
    metrics: PerformanceNavigationTiming;
    paints: Record<string, number>;
};

export type SpaNavigationMetric = {
    type: 'spa-navigation';
    timestamp: number;
    url: string;
    start: number;
    end: number;
    duration: number;
};

export type PerformanceMetric = PageLoadMetric | SpaNavigationMetric;

export class PerformanceStore {
    pageLoadMetrics: Writable<PageLoadMetric[]>;
    spaNavigationMetrics: Writable<SpaNavigationMetric[]>;

    private spaNavStart: number | null = null;

    constructor() {
        this.pageLoadMetrics = writable([]);
        this.spaNavigationMetrics = writable([]);
        if (browser) {
            onMount(() => {
                this.collectPageLoadMetric();
                this.setupSpaNavigationTracking();
            });
        }
    }

    private collectPageLoadMetric() {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
            const nav = navEntries[0];
            const paints: Record<string, number> = {};
            performance.getEntriesByType('paint').forEach((entry) => {
                paints[entry.name] = entry.startTime;
            });
            this.pageLoadMetrics.update((metrics) => [
                {
                    type: 'page-load',
                    timestamp: Date.now(),
                    url: window.location.href,
                    metrics: nav,
                    paints
                },
                ...metrics
            ]);
        }
    }

    private setupSpaNavigationTracking() {
        beforeNavigate(() => {
            this.spaNavStart = performance.now();
        });
        afterNavigate(() => {
            if (this.spaNavStart !== null) {
                const end = performance.now();
                this.spaNavigationMetrics.update((metrics) => [
                    {
                        type: 'spa-navigation',
                        timestamp: Date.now(),
                        url: window.location.href,
                        start: this.spaNavStart!,
                        end,
                        duration: end - this.spaNavStart!
                    },
                    ...metrics
                ]);
                this.spaNavStart = null;
            }
        });
    }

    clearPageLoadMetrics() {
        this.pageLoadMetrics.set([]);
    }
    clearSpaNavigationMetrics() {
        this.spaNavigationMetrics.set([]);
    }
}

const PERFORMANCE_STORE_KEY = Symbol('PERFORMANCE_STORE');
let _store: PerformanceStore | null = null;

/**
 * Initializes and sets the global performance store in Svelte context.
 * Call this once at the root layout.
 */
export function initPerformanceStore() {
    if (!_store) {
        _store = new PerformanceStore();
        setContext(PERFORMANCE_STORE_KEY, _store);
    }
    return _store;
}

/**
 * Gets the global performance store from Svelte context.
 * Use in any component that needs to read metrics.
 */
export function getPerformanceStore() {
    return getContext<PerformanceStore>(PERFORMANCE_STORE_KEY);
}
