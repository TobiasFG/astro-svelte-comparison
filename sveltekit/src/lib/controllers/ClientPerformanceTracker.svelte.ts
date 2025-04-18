import { browser } from "$app/environment";
import { getContext, setContext } from "svelte";

/**
 * ClientPagePerformanceTracker is a class that tracks and exposes performance metrics for client pages
 */
export class ClientPagePerformanceTracker {
    // State variables controls
    isOpen = $state<boolean>(false);
    isLoading = $state<boolean>(true);

    // Navigation Performance entries
    RequestSentMark = $state<number | null>(null);
    ResponseReceivedMark = $state<number | null>(null);
    ResponseDownloadDuration = $state<number | null>(null);
    ResponseCompleteMark = $state<number | null>(null);
    DomInteractiveMark = $state<number | null>(null);
    DomCompleteMark = $state<number | null>(null);

    // Resource Performance entries
    TotalResourceCount = $state<number>(0);
    TotalResourceFromCacheCount = $state<number>(0);
    TotalResourceDownloadTimeSpent = $state<number>(0);


    constructor() {
        if (browser) {
            // Initialize performance tracking
            this.initializePerformanceTracking();
        }
    }

    TogglePerformanceTracker() {
        this.isOpen = !this.isOpen;
    }

    initializePerformanceTracking() {
        //entryTypes: ["element", "event", "first-input", "largest-contentful-paint", "layout-shift", "long-animation-frame", "longtask", "mark", "measure", "navigation", "paint", "resource", "visibility-state"],
        if (typeof window !== "undefined" && "PerformanceObserver" in window) {
            const performanceObserver = new PerformanceObserver((metrics) => {
                metrics.getEntries().forEach((entry) => {
                    switch (entry.entryType) {
                        case "navigation":
                            this.RequestSentMark = (entry as PerformanceNavigationTiming).requestStart;
                            this.ResponseReceivedMark = (entry as PerformanceNavigationTiming).responseStart;
                            this.ResponseDownloadDuration = (entry as PerformanceNavigationTiming).responseEnd - (entry as PerformanceNavigationTiming).responseStart;
                            this.ResponseCompleteMark = (entry as PerformanceNavigationTiming).responseEnd;
                            this.DomInteractiveMark = (entry as PerformanceNavigationTiming).domInteractive;
                            this.DomCompleteMark = (entry as PerformanceNavigationTiming).domComplete;
                            break;
                        case "resource":
                            this.TotalResourceCount++;
                            if ((entry as PerformanceResourceTiming).deliveryType === "cache") this.TotalResourceFromCacheCount++;
                            this.TotalResourceDownloadTimeSpent += (entry as PerformanceResourceTiming).duration;
                            break;
                        default:
                            console.log("entry", entry);
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
    return getContext<ReturnType<typeof initClientPagePerformanceTracker>>(SYMBOL);
};