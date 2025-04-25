import { browser } from "$app/environment";
import { afterNavigate, beforeNavigate } from "$app/navigation";
import { getContext, onMount, setContext } from "svelte";

export type TimingMetric = {
    start: number | null;
    end: number | null;
    duration: number | null;
};

export class PerformanceTracker {
    // Navigation timings (all relative to navigationStart)
    redirect = $state<TimingMetric>({ start: null, end: null, duration: null });
    worker = $state<TimingMetric>({ start: null, end: null, duration: null });
    fetch = $state<TimingMetric>({ start: null, end: null, duration: null });
    dns = $state<TimingMetric>({ start: null, end: null, duration: null });
    tcp = $state<TimingMetric>({ start: null, end: null, duration: null });
    tls = $state<TimingMetric>({ start: null, end: null, duration: null });
    request = $state<TimingMetric>({ start: null, end: null, duration: null });
    response = $state<TimingMetric>({ start: null, end: null, duration: null });
    domContentLoaded = $state<TimingMetric>({ start: null, end: null, duration: null });
    domInteractive = $state<TimingMetric>({ start: null, end: null, duration: null });
    domComplete = $state<TimingMetric>({ start: null, end: null, duration: null });
    unloadEvent = $state<TimingMetric>({ start: null, end: null, duration: null });
    loadEvent = $state<TimingMetric>({ start: null, end: null, duration: null });

    // Paint metrics
    firstPaint = $state<TimingMetric>({ start: null, end: null, duration: null });
    firstContentfulPaint = $state<TimingMetric>({ start: null, end: null, duration: null });
    largestContentfulPaint = $state<TimingMetric>({ start: null, end: null, duration: null });

    // Svelte hydration
    svelteHydration = $state<TimingMetric>({ start: null, end: null, duration: null });

    // Soft navigation (SPA) timing
    spaNavigation = $state<TimingMetric>({ start: null, end: null, duration: null });
    private spaNavStart: number | null = null;

    // Resource metrics
    totalResourceCount = 0;
    totalResourceFromCacheCount = 0;
    totalResourceDownloadTimeSpent = 0;
    hasBlockingResources = false;
    recentResources: PerformanceResourceTiming[] = [];

    constructor() {

        if (browser) {
            this.initializePerformanceTracking();


            if (performance) {
                performance.mark('hydrateStart');

                $effect(() => {
                    performance.mark('hydrateEnd');
                    performance.measure('hydrate', 'hydrateStart', 'hydrateEnd');
                });
            }

            beforeNavigate(() => {
                // Only track soft navigation if not a full reload
                this.spaNavStart = performance.now();
                this.spaNavigation = { start: this.spaNavStart, end: null, duration: null };
            });
            afterNavigate(() => {
                if (this.spaNavStart !== null) {
                    const end = performance.now();
                    this.spaNavigation = {
                        start: this.spaNavStart,
                        end,
                        duration: end - this.spaNavStart
                    };
                    this.spaNavStart = null;
                }
            });
        }

        beforeNavigate((navigation) => {
            console.log("beforeNavigate", navigation);
            this.redirect = { start: null, end: null, duration: null };
            this.worker = { start: null, end: null, duration: null };
            this.fetch = { start: null, end: null, duration: null };
            this.dns = { start: null, end: null, duration: null };
            this.tcp = { start: null, end: null, duration: null };
            this.tls = { start: null, end: null, duration: null };
            this.request = { start: null, end: null, duration: null };
            this.response = { start: null, end: null, duration: null };
            this.domContentLoaded = { start: null, end: null, duration: null };
            this.domInteractive = { start: null, end: null, duration: null };
            this.domComplete = { start: null, end: null, duration: null };
            this.unloadEvent = { start: null, end: null, duration: null };
            this.loadEvent = { start: null, end: null, duration: null };
            this.firstPaint = { start: null, end: null, duration: null };
            this.firstContentfulPaint = { start: null, end: null, duration: null };
            this.largestContentfulPaint = { start: null, end: null, duration: null };
            this.svelteHydration = { start: null, end: null, duration: null };
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
                            const navigationStart = navEntry.startTime;
                            this.redirect = {
                                start: navEntry.redirectStart - navigationStart,
                                end: navEntry.redirectEnd - navigationStart,
                                duration: navEntry.redirectEnd - navEntry.redirectStart
                            };
                            this.worker = {
                                start: navEntry.workerStart > 0 ? navEntry.workerStart - navigationStart : null,
                                end: navEntry.workerStart > 0 ? navEntry.fetchStart - navigationStart : null,
                                duration: navEntry.workerStart > 0 ? navEntry.fetchStart - navEntry.workerStart : null
                            };
                            this.fetch = {
                                start: navEntry.fetchStart - navigationStart,
                                end: navEntry.domainLookupStart - navigationStart,
                                duration: navEntry.domainLookupStart - navEntry.fetchStart
                            };
                            this.dns = {
                                start: navEntry.domainLookupStart - navigationStart,
                                end: navEntry.domainLookupEnd - navigationStart,
                                duration: navEntry.domainLookupEnd - navEntry.domainLookupStart
                            };
                            this.tcp = {
                                start: navEntry.connectStart - navigationStart,
                                end: navEntry.connectEnd - navigationStart,
                                duration: navEntry.connectEnd - navEntry.connectStart
                            };
                            this.tls = {
                                start: navEntry.secureConnectionStart > 0 ? navEntry.secureConnectionStart - navigationStart : null,
                                end: navEntry.secureConnectionStart > 0 ? navEntry.connectEnd - navigationStart : null,
                                duration: navEntry.secureConnectionStart > 0 ? navEntry.connectEnd - navEntry.secureConnectionStart : null
                            };
                            this.request = {
                                start: navEntry.requestStart - navigationStart,
                                end: navEntry.responseStart - navigationStart,
                                duration: navEntry.responseStart - navEntry.requestStart
                            };
                            this.response = {
                                start: navEntry.responseStart - navigationStart,
                                end: navEntry.responseEnd - navigationStart,
                                duration: navEntry.responseEnd - navEntry.responseStart
                            };
                            this.domContentLoaded = {
                                start: navEntry.domContentLoadedEventStart - navigationStart,
                                end: navEntry.domContentLoadedEventEnd - navigationStart,
                                duration: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
                            };
                            this.domInteractive = {
                                start: navEntry.domInteractive - navigationStart,
                                end: navEntry.domComplete - navigationStart,
                                duration: navEntry.domComplete - navEntry.domInteractive
                            };
                            this.domComplete = {
                                start: navEntry.domComplete - navigationStart,
                                end: navEntry.domComplete - navigationStart,
                                duration: 0
                            };
                            this.unloadEvent = {
                                start: navEntry.unloadEventStart - navigationStart,
                                end: navEntry.unloadEventEnd - navigationStart,
                                duration: navEntry.unloadEventEnd - navEntry.unloadEventStart
                            };
                            this.loadEvent = {
                                start: navEntry.loadEventStart - navigationStart,
                                end: navEntry.loadEventEnd - navigationStart,
                                duration: navEntry.loadEventEnd - navEntry.loadEventStart
                            };
                            break;
                        case "paint":
                            console.log("PerformanceObserver entry", entry);
                            const paintEntry = entry as PerformanceEntry;
                            if (paintEntry.name === 'first-paint') {
                                if (this.firstPaint.start) break;
                                this.firstPaint = {
                                    start: paintEntry.startTime,
                                    end: paintEntry.startTime + paintEntry.duration,
                                    duration: paintEntry.duration
                                };
                            } else if (paintEntry.name === 'first-contentful-paint') {
                                if (this.firstContentfulPaint.start) break;
                                this.firstContentfulPaint = {
                                    start: paintEntry.startTime,
                                    end: paintEntry.startTime + paintEntry.duration,
                                    duration: paintEntry.duration
                                };
                            }
                            break;
                        case "largest-contentful-paint":
                            console.log("PerformanceObserver entry", entry);

                            if (this.largestContentfulPaint.start) break;
                            const lcpEntry = entry as any;
                            this.largestContentfulPaint = {
                                start: lcpEntry.startTime,
                                end: lcpEntry.startTime + lcpEntry.duration,
                                duration: lcpEntry.duration
                            };
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
                        case "measure":
                            console.log("PerformanceObserver entry", entry);
                            const measureEntry = entry as PerformanceMeasure;
                            if (measureEntry.name === 'hydrate') {
                                this.svelteHydration = {
                                    start: measureEntry.startTime,
                                    end: measureEntry.startTime + measureEntry.duration,
                                    duration: measureEntry.duration
                                };
                            }
                            break;
                        default:
                            console.log("PerformanceObserver entry", entry);
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
                type: "largest-contentful-paint"
            });
        }
    }
}

const SYMBOL = Symbol('ClientPagePerformanceTracker');

export const initPerformanceTracker = () => {
    return setContext(SYMBOL, new PerformanceTracker());
};

export const getPerformanceTracker = () => {
    return getContext<PerformanceTracker>(SYMBOL);
};