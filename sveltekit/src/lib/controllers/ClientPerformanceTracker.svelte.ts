import { browser } from "$app/environment";
import { getContext, setContext } from "svelte";

export class ClientPagePerformanceTracker {
    isOpen = $state(false);
    isLoading = $state(true);
    requestSentMark = $state<number | null>(null);
    responseReceivedMark = $state<number | null>(null);
    responseDownloadDuration = $state<number | null>(null);
    responseCompleteMark = $state<number | null>(null);
    domInteractiveMark = $state<number | null>(null);
    domCompleteMark = $state<number | null>(null);
    totalResourceCount = $state(0);
    totalResourceFromCacheCount = $state(0);
    totalResourceDownloadTimeSpent = $state(0);
    hasBlockingResources = $state(false);
    recentResources = $state<PerformanceResourceTiming[]>([]);

    constructor() {

        if (browser) {
            this.initializePerformanceTracking();
        }
    }

    togglePerformanceTracker() {
        this.isOpen = !this.isOpen;
    }

    private initializePerformanceTracking() {
        if (typeof window !== "undefined" && "PerformanceObserver" in window) {
            const performanceObserver = new PerformanceObserver((metrics) => {
                metrics.getEntries().forEach((entry) => {
                    switch (entry.entryType) {
                        case "navigation":
                            const navEntry = entry as PerformanceNavigationTiming;
                            this.requestSentMark = navEntry.requestStart;
                            this.responseReceivedMark = navEntry.responseStart;
                            this.responseDownloadDuration = navEntry.responseEnd - navEntry.responseStart;
                            this.responseCompleteMark = navEntry.responseEnd;
                            this.domInteractiveMark = navEntry.domInteractive;
                            this.domCompleteMark = navEntry.domComplete;
                            break;
                        case "resource":
                            const resourceEntry = entry as PerformanceResourceTiming;
                            this.totalResourceCount++;
                            if (resourceEntry.deliveryType === "cache") {
                                this.totalResourceFromCacheCount++;
                            }
                            this.totalResourceDownloadTimeSpent += resourceEntry.duration;

                            if (resourceEntry.renderBlockingStatus === "blocking") {
                                this.hasBlockingResources = true;
                            }

                            this.recentResources = [resourceEntry, ...this.recentResources.slice(0, 9)];
                            break;
                    }
                });
            });

            console.log("PerformanceObserver initialized", PerformanceObserver.supportedEntryTypes);
            performanceObserver.observe({
                buffered: true,
                type: "element"
            });
            performanceObserver.observe({
                buffered: true,
                type: "event"
            });
            performanceObserver.observe({
                buffered: true,
                type: "largest-contentful-paint"
            });
            performanceObserver.observe({
                buffered: true,
                type: "layout-shift"
            });
            performanceObserver.observe({
                buffered: true,
                type: "long-animation-frame"
            });
            performanceObserver.observe({
                buffered: true,
                type: "longtask"
            });
            performanceObserver.observe({
                buffered: true,
                type: "mark"
            });
            performanceObserver.observe({
                buffered: true,
                type: "measure"
            });
            performanceObserver.observe({
                buffered: true,
                type: "navigation"
            });
            performanceObserver.observe({
                buffered: true,
                type: "paint"
            });
            performanceObserver.observe({
                buffered: true,
                type: "resource"
            });
            performanceObserver.observe({
                buffered: true,
                type: "first-contentful-paint"
            });
            performanceObserver.observe({
                buffered: true,
                type: "largest-contentful-paint"
            });
        }
    }
}

const SYMBOL = Symbol('ClientPagePerformanceTracker');

export const initClientPagePerformanceTracker = () => {
    return setContext(SYMBOL, new ClientPagePerformanceTracker());
};

export const getClientPagePerformanceTracker = () => {
    return getContext<ClientPagePerformanceTracker>(SYMBOL);
};