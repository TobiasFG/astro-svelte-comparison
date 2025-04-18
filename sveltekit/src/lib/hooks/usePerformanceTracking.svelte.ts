import { onMount, onDestroy, getContext, setContext } from 'svelte';
import { beforeNavigate, afterNavigate } from '$app/navigation';
import { browser } from '$app/environment';

/**
 * Type definition for performance entry metrics
 */
export type PerformanceEntries = {
    ttfb: number | null;              // Time to First Byte
    fcp: number | null;               // First Contentful Paint
    lcp: number | null;               // Largest Contentful Paint
    cls: number | null;               // Cumulative Layout Shift
    fid: number | null;               // First Input Delay
    tbt: number | null;               // Total Blocking Time
    resourceLoad: number | null;      // Resource Load Time
    scriptExecution: number | null;   // Script Execution Time
};

/**
 * Class for tracking performance metrics in SvelteKit applications.
 * Uses Svelte 5 runes for reactive state.
 */
export class PerformanceTracker {
    // Initial page load tracking
    initialRenderStart = $state(new Date());
    initialRenderComplete = $state<Date | null>(null);
    domContentLoaded = $state<number | null>(null);
    fullPageLoad = $state<number | null>(null);

    // SPA navigation tracking
    navigationStart = $state<Date | null>(null);
    navigationComplete = $state<Date | null>(null);

    // Computed metrics using $derived
    initialRenderTime = $derived(
        this.initialRenderComplete !== null
            ? this.initialRenderComplete.getTime() - this.initialRenderStart.getTime()
            : null
    );

    navigationTime = $derived(
        this.navigationStart !== null && this.navigationComplete !== null
            ? this.navigationComplete.getTime() - this.navigationStart.getTime()
            : null
    );

    // Additional performance metrics
    performanceEntries = $state<PerformanceEntries>({
        ttfb: null,
        fcp: null,
        lcp: null,
        cls: null,
        fid: null,
        tbt: null,
        resourceLoad: null,
        scriptExecution: null,
    });

    // Track whether the component is hydrated
    isHydrated = $state(false);

    // Performance observers
    private observers: PerformanceObserver[] = [];

    constructor() {
        if (browser) {
            onMount(() => {
                // Mark as hydrated immediately when mounted
                this.isHydrated = true;
    
                // Use requestAnimationFrame to detect when rendering is complete
                requestAnimationFrame(() => {
                    this.initialRenderComplete = new Date();
                });
    
                // Get precise timing using Performance API (if available)
                if (typeof performance !== 'undefined' && 'PerformanceObserver' in window) {
                    this.initializePerformanceTracking();
                }
    
                // Set up SPA navigation tracking
                beforeNavigate(() => {
                    this.navigationStart = new Date();
                });
    
                afterNavigate(() => {
                    this.navigationComplete = new Date();
                });
            });

            onDestroy(() => {
                // Clean up observers
                this.observers.forEach(observer => observer.disconnect());
                this.observers = [];
            });
        }
    }

    private initializePerformanceTracking() {
        try {
            // Use setTimeout to ensure this runs after page is fully loaded
            setTimeout(() => {
                this.collectInitialPerformanceData();
                this.setupPerformanceObservers();
            }, 0);
        } catch (e) {
            console.error('Error collecting performance metrics:', e);
        }
    }

    private collectInitialPerformanceData() {
        // Navigation timing data using the newer getEntries() method
        const navigationEntries = performance.getEntries().filter(
            entry => entry.entryType === 'navigation'
        );

        if (navigationEntries.length > 0) {
            const nav = navigationEntries[0] as PerformanceNavigationTiming;

            // Calculate key metrics
            this.performanceEntries = {
                ...this.performanceEntries,
                ttfb: nav.responseStart - nav.fetchStart,
                resourceLoad: nav.domContentLoadedEventEnd - nav.domInteractive,
                scriptExecution: nav.domComplete - nav.domInteractive
            };

            this.domContentLoaded = nav.domContentLoadedEventEnd - nav.fetchStart;
            this.fullPageLoad = nav.loadEventEnd - nav.fetchStart;
        }

        // Paint metrics using PerformanceObserver
        const paintEntries = performance.getEntries().filter(
            entry => entry.entryType === 'paint'
        );

        for (const paint of paintEntries) {
            if ((paint as PerformancePaintTiming).name === 'first-contentful-paint') {
                this.performanceEntries = {
                    ...this.performanceEntries,
                    fcp: paint.startTime
                };
            }
        }
    }

    private setupPerformanceObservers() {
        // FCP Observer
        this.observeEntryType('paint', entries => {
            for (const entry of entries) {
                if ((entry as PerformancePaintTiming).name === 'first-contentful-paint') {
                    this.performanceEntries = {
                        ...this.performanceEntries,
                        fcp: entry.startTime
                    };
                }
            }
        });

        // LCP Observer
        this.observeEntryType('largest-contentful-paint', entries => {
            if (entries.length > 0) {
                // The last entry is the largest contentful paint
                const lastEntry = entries[entries.length - 1];
                this.performanceEntries = {
                    ...this.performanceEntries,
                    lcp: lastEntry.startTime
                };
            }
        });

        // CLS Observer
        let clsValue = 0;
        this.observeEntryType('layout-shift', entries => {
            for (const entry of entries) {
                // Cast entry to any as LayoutShift type might not be available
                const layoutShift = entry as any;
                if (!layoutShift.hadRecentInput) {
                    clsValue += layoutShift.value;
                    this.performanceEntries = {
                        ...this.performanceEntries,
                        cls: clsValue
                    };
                }
            }
        });

        // FID Observer
        this.observeEntryType('first-input', entries => {
            for (const entry of entries) {
                this.performanceEntries = {
                    ...this.performanceEntries,
                    fid: (entry as PerformanceEventTiming).processingStart -
                        (entry as PerformanceEventTiming).startTime
                };
                break; // We only need the first input delay
            }
        });
    }

    private observeEntryType(
        type: string,
        callback: (entries: PerformanceEntry[]) => void
    ) {
        try {
            const observer = new PerformanceObserver(entryList => {
                callback(entryList.getEntries());
            });

            observer.observe({ type, buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.debug(`${type} observation not supported:`, e);
        }
    }

    /**
     * Format a time value in milliseconds to a readable string
     */
    formatTime(ms: number | null): string {
        if (ms === null) return 'N/A';
        return `${Math.round(ms)}ms`;
    }

    /**
     * Get navigation timing data from the Performance API
     */
    getNavigationTimingData(): Record<string, any> | null {
        if (typeof performance === 'undefined') {
            return null;
        }

        // Use getEntries() instead of deprecated getEntriesByType()
        const navEntries = performance.getEntries().filter(
            entry => entry.entryType === 'navigation'
        );

        return navEntries.length > 0 ? navEntries[0] : null;
    }

    /**
     * Get a summary of the current performance metrics
     */
    getSummary(): Record<string, string> {
        return {
            initialRender: this.formatTime(this.initialRenderTime),
            navigationTime: this.formatTime(this.navigationTime),
            ttfb: this.formatTime(this.performanceEntries.ttfb),
            fcp: this.formatTime(this.performanceEntries.fcp),
            lcp: this.formatTime(this.performanceEntries.lcp),
            domContentLoaded: this.formatTime(this.domContentLoaded),
            pageLoad: this.formatTime(this.fullPageLoad),
            hydrated: this.isHydrated ? 'Yes' : 'No'
        };
    }
}

const PERFORMANCE_TRACKER_KEY = Symbol('PERFORMANCE_TRACKER');

/**
 * Initialize and store a performance tracker instance in the component context
 */
export function initPerformanceTracker() {
    return setContext(PERFORMANCE_TRACKER_KEY, new PerformanceTracker());
}

/**
 * Get the performance tracker from the current component context
 */
export function getPerformanceTracker() {
    return getContext<PerformanceTracker>(PERFORMANCE_TRACKER_KEY);
}

/**
 * Legacy hook API for backward compatibility
 * @deprecated Use initPerformanceTracker() and getPerformanceTracker() instead
 */
export function usePerformanceTracking() {
    const tracker = initPerformanceTracker();
    return tracker;
}
