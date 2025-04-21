import { browser } from "$app/environment";
import { beforeNavigate } from "$app/navigation";
import { getContext, setContext } from "svelte";

export class ClientPerformanceTracker {
    requestSentMark = $state<number | null>(null);
    responseReceivedMark = $state<number | null>(null);
    responseDelayDuration = $state<number | null>(null);
    responseCompleteMark = $state<number | null>(null);
    responseDownloadDuration = $state<number | null>(null);
    firstPaintMark = $state<number | null>(null);
    firstPaintDuration = $state<number | null>(null);
    firstContentfulPaintMark = $state<number | null>(null);
    firstContentfulPaintDuration = $state<number | null>(null);
    largestContentfulPaintMark = $state<number | null>(null);
    largestContentfulPaintDuration = $state<number | null>(null);
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

        beforeNavigate((navigation) => {
            console.log("beforeNavigate", navigation);
            this.requestSentMark = null;
            this.responseReceivedMark = null;
            this.responseDelayDuration = null;
            this.responseCompleteMark = null;
            this.responseDownloadDuration = null;
            this.firstPaintMark = null;
            this.firstContentfulPaintMark = null;
            this.largestContentfulPaintMark = null;
            this.domInteractiveMark = null;
            this.domCompleteMark = null;
            this.totalResourceCount = 0;
            this.totalResourceFromCacheCount = 0;
            this.totalResourceDownloadTimeSpent = 0;
            this.hasBlockingResources = false;
            this.recentResources = [];
        });
    }

    private initializePerformanceTracking() {
        if (typeof window !== "undefined" && "PerformanceObserver" in window) {
            const performanceObserver = new PerformanceObserver((metrics) => {
                metrics.getEntries().forEach((entry) => {
                    switch (entry.entryType) {
                        case "navigation":
                            console.log("PerformanceObserver entry", entry);
                            const navEntry = entry as PerformanceNavigationTiming;
                            this.requestSentMark = navEntry.requestStart;
                            this.responseReceivedMark = navEntry.responseStart;
                            this.responseDelayDuration = navEntry.responseStart - navEntry.requestStart;
                            this.responseCompleteMark = navEntry.responseEnd;
                            this.responseDownloadDuration = navEntry.responseEnd - navEntry.responseStart;
                            this.domInteractiveMark = navEntry.domInteractive;
                            this.domCompleteMark = navEntry.domComplete;
                            break;
                        case "resource":
                            const resourceEntry = entry as PerformanceResourceTiming;
                            if (resourceEntry.duration < 0.1) break;
                            this.totalResourceCount++;
                            if (resourceEntry.deliveryType === "cache") {
                                this.totalResourceFromCacheCount++;
                            }
                            this.totalResourceDownloadTimeSpent += resourceEntry.duration;

                            if (resourceEntry.renderBlockingStatus === "blocking") {
                                this.hasBlockingResources = true;
                            }

                            this.recentResources = [resourceEntry, ...this.recentResources];
                            break;
                        default:
                            console.log("PerformanceObserver entry", entry);
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
            // performanceObserver.observe({
            //     buffered: true,
            //     type: "layout-shift"
            // });
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
            // performanceObserver.observe({
            //     buffered: true,
            //     type: "paint"
            // });
            performanceObserver.observe({
                buffered: true,
                type: "resource"
            });
            // performanceObserver.observe({
            //     buffered: true,
            //     type: "largest-contentful-paint"
            // });
        }
    }
}

const SYMBOL = Symbol('ClientPagePerformanceTracker');

export const initClientPagePerformanceTracker = () => {
    return setContext(SYMBOL, new ClientPerformanceTracker());
};

export const getClientPagePerformanceTracker = () => {
    return getContext<ClientPerformanceTracker>(SYMBOL);
};